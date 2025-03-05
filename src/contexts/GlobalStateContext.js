import React, { createContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";


// Define socket server URL using the env variables
const SOCKET_SERVER_URL =  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';


console.log(SOCKET_SERVER_URL);

// Create the context
export const GlobalStateContext = createContext();

// Provider Component
export const GlobalStateProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null); // Store socket connection

  // WebSocket connection
  useEffect(() => {
    if (!isConnected || !userInfo.uid) return;
  
    console.log("🔌 Connecting to WebSocket...");
  
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      query: { userId: userInfo.uid },
    });
  
    setSocket(newSocket);
  
    newSocket.on("connect", () => {
      console.log("✅ WebSocket Connected:", newSocket.id);
    });
  
    newSocket.on("disconnect", (reason) => {
      console.warn("❌ WebSocket Disconnected:", reason);
      if (reason === "transport close") {
        console.log("🔄 Attempting to reconnect WebSocket...");
        setTimeout(() => {
          setSocket(io(SOCKET_SERVER_URL, { transports: ["websocket"], reconnection: true }));
        }, 3000);
      }
    });
  
    // 📦 Listen for delivery updates
    newSocket.on("updateDeliveries", (update) => {
      console.log("📡 Received WebSocket Update:", update);
  
      setDeliveries((prevDeliveries) => {
        let updatedDeliveries = [...prevDeliveries];
  
        if (update.type === "new") {
          console.log("➕ Adding new delivery:", update.data);
          updatedDeliveries = [...updatedDeliveries, update.data];
        } else if (update.type === "update") {
          console.log("🔄 Updating delivery:", update.data);
          updatedDeliveries = updatedDeliveries.map((delivery) =>
            delivery.id === update.data.id ? update.data : delivery
          );
        } else if (update.type === "delete") {
          console.log("🗑️ Removing deleted delivery:", update.id);
          updatedDeliveries = updatedDeliveries.filter((delivery) => delivery.id !== update.id);
        }
  
        return [...updatedDeliveries]; // Force React to update state
      });
    });
  
    return () => {
      console.log("🔌 Disconnecting WebSocket...");
      newSocket.disconnect();
    };
  }, [isConnected, userInfo.uid]);

  // Get today's date in YYYY/MM/DD format (Israel timezone)
  const getTodayDate = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const [{ value: month }, , { value: day }, , { value: year }] = formatter.formatToParts(now);
    return { year, month, day };
  };

  // Fetch all data (businesses, users, deliveries)
  const fetchAllData = async () => {
    if (!isConnected || !userInfo.uid) return;

    setLoading(true);
    console.log("Fetching all data...");

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const { year, month, day } = getTodayDate();

      // Fetch all data in parallel
      const [businessesRes, usersRes, deliveriesRes] = await Promise.all([
        axios.get(`${SOCKET_SERVER_URL}/api/bussiness`, { headers }),
        axios.get(`${SOCKET_SERVER_URL}/api/users/users`, { headers }),
        axios.get(`${SOCKET_SERVER_URL}/api/deliveries/${year}/${month}/${day}`, { headers }),
      ]);

      // Update state once all data is available
      setBusinesses(businessesRes.data);
      setUsers(usersRes.data);

      const deliveryArray = Object.entries(deliveriesRes.data).map(([id, details]) => ({
        id,
        ...details,
      }));
      console.log("delivery array",deliveryArray);
      setDeliveries(deliveryArray);
      

      

      // Filter myTasks based on userInfo.uid
      const filteredTasks = deliveryArray.filter(
        (delivery) => delivery.deliver === userInfo.uid && delivery.status === false
      );
      setMyTasks(filteredTasks);

      console.log("All data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (isConnected && userInfo.uid) {
      fetchAllData();
    }
  }, [isConnected, userInfo.uid]);
  

  return (
    <GlobalStateContext.Provider
      value={{
        userInfo,
        deliveries,
        users,
        myTasks,
        businesses,
        setDeliveries,
        setUsers,
        setMyTasks,
        setBusinesses,
        setUserInfo,
        setIsConnected,
        loading,
        socket, // Provide socket instance to other components
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

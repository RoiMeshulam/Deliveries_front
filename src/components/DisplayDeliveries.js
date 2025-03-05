import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Platform, Alert, Text } from 'react-native';
import DeliveryDetails from './DeliveryDetails';
import { GlobalStateContext } from "../contexts/GlobalStateContext";
import MyButton from './styleComponents/MyButton';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AssignDeliverer from './AssignDeliverer';
import CustomAlert from './styleComponents/CustomAlert';

const DisplayDeliveries = ({ deliveries, userInfo }) => {
    const { users, businesses } = useContext(GlobalStateContext);
    const [selectedDeliveries, setSelectedDeliveries] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState({ title: "", message: "", type: "" });

    const showCustomAlert = (title, message, type) => {
        setAlertData({ title, message, type });
        setAlertVisible(true);
      };

    // for expo go emulator
    // const SOCKET_SERVER_URL =
    //     Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
    
    // for android emulator
    const SOCKET_SERVER_URL =
    Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";


    // update selected deliveries state
    const handleDeliverySelection = (delivery) => {
        setSelectedDeliveries((prev) => {
            if (prev.some((d) => d.id === delivery.id)) {
                return prev.filter((d) => d.id !== delivery.id);
            } else {
                return [...prev, delivery];
            }
        });
    };

    function getGroupCode(groupId) {
        console.log(`${groupId} check id`);
        switch (groupId) {
            case '120363323823233206@g.us':
                return 'X1eW2CC0X9CJKqJZOcyE';
            case '120363337977447321@g.us':
                return 'lhdjdPp3ThfCrm53KnIg';
            case '120363324758446250@g.us':
                return 'YourValueForGroup3'; // Replace with actual value
            default:
                return null; // Or handle unknown IDs differently
        }
    }

    function getRelevantBusiness(businessId) {
        if (businessId && businesses.length > 0) {
            const ans = businesses.find((business) => business.id === businessId) || null;
            return ans;
        }
        return null;
    };

    // actions functions
    const assignDeliverer = async (deliverer) => {
        try {
            const { year, month, day } = getTodayDate();
            const headers = await getAuthHeaders(); // Get authorization headers

            for (const delivery of selectedDeliveries) {
                const url = `${SOCKET_SERVER_URL}/api/deliveries/${year}/${month}/${day}/${delivery.id}`;
                console.log(url);
                await axios.put(url, { ...delivery, deliver: deliverer.uid }, headers);
            }

            showCustomAlert("צימוד שליח!", "המשלוח הוקצה לשליח כבקשתך", "success");
            setModalVisible(false);
            setSelectedDeliveries([]);
        } catch (error) {
            console.error("Failed to assign deliverer:", error);
            Alert.alert("Error", "Failed to assign deliverer.");
        }
    };

    const markAsGiven = async () => {
        try {
            const { year, month, day } = getTodayDate();
            const headers = await getAuthHeaders();

            for (const delivery of selectedDeliveries) {
                const url = `${SOCKET_SERVER_URL}/api/deliveries/${year}/${month}/${day}/${delivery.id}`;
                await axios.put(url, { ...delivery, status: true }, headers);
            }
            showCustomAlert("מסירת משלוח", "המשלוח נמסר ללקוח!", "success");
            setSelectedDeliveries([]);
        } catch (error) {
            console.error("Failed to mark as given:", error);
            Alert.alert("Error", "Failed to mark as given.");
        }
    };

    const deleteDelivery = async () => {
        try {
            const { year, month, day } = getTodayDate();
            const headers = await getAuthHeaders();

            for (const delivery of selectedDeliveries) {
                const url = `${SOCKET_SERVER_URL}/api/deliveries/${year}/${month}/${day}/${delivery.id}`;
                await axios.delete(url, headers);
            }

            showCustomAlert("מחיקת משלוח", "המשלוח נמחק ולא יופיע במערכת!","success");
            setSelectedDeliveries([]);
        } catch (error) {
            console.error("Failed to delete deliveries:", error);
            Alert.alert("Error", "Failed to delete deliveries.");
        }
    };

    // helper functions
    const getAuthHeaders = async () => {
        const token = await AsyncStorage.getItem("token"); // Retrieve token from storage
        return {
            headers: { Authorization: `Bearer ${token}` },
        };
    };

    const getTodayDate = () => {
        // Define the Jerusalem time zone
        const timeZone = 'Asia/Jerusalem';

        // Get the current date and time in the specified time zone
        const today = new Date();
        const options = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const formattedDate = formatter.format(today);

        // Extract day, month, and year from the formatted date
        const [day, month, year] = formattedDate.split('/');

        // Print the current date and time in Jerusalem time
        // console.log(`Current date and time in Jerusalem: ${today.toLocaleString('en-GB', { timeZone })}`);
        // console.log({ year, month, day })
        return { year, month, day };
    };

    if (deliveries.length === 0) {
        return (
            <View style={styles.empty}>
                <Text style={styles.noDeliveriesText}>אין משלוחים</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={deliveries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleDeliverySelection(item)}
                        style={[
                            styles.deliveryItem,
                            selectedDeliveries.some((d) => d.id === item.id) && styles.selectedItem,
                        ]}
                    >
                        <DeliveryDetails
                            businessDetails={getRelevantBusiness(getGroupCode(item.businessId))}
                            deliveryDetails={item}
                            users={users}
                        />
                    </TouchableOpacity>
                )}
            />

            {/* Action Buttons */}
            {selectedDeliveries.length > 0 && (
                <View style={styles.actionButtonsContainer}>
                    <MyButton
                        title="נמסר"
                        onPress={markAsGiven}
                        style={styles.deliveredButton}
                        textStyle={styles.actionButtonText}
                        iconName="checkmark-circle" // Example icon, you can change it
                    />

                    {userInfo.role === 'admin' && (
                        <>
                            <MyButton
                                title="צימוד שליח"
                                onPress={() => setModalVisible(true)}
                                style={styles.pairButton}
                                textStyle={styles.actionButtonText}
                                iconName="people"
                            />

                            <MyButton
                                title="מחיקה"
                                onPress={deleteDelivery}
                                style={styles.deleteButton}
                                textStyle={styles.actionButtonText}
                                iconName="trash"
                            />
                        </>
                    )}
                </View>
            )}

            <AssignDeliverer
                users={users}
                assignDeliverer={assignDeliverer}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />

             {/* Custom Alert Component */}
             <CustomAlert
                visible={alertVisible}
                title={alertData.title}
                message={alertData.message}
                onClose={() => setAlertVisible(false)}
                type = {alertData.type}
            />

        </View>
    );
};

export default DisplayDeliveries;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    list: {
        flex: 1,
        marginBottom: 10,
    },
    deliveryItem: {
        marginVertical: 5,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    selectedItem: {
        borderWidth: 1.5,
        backgroundColor: "#FFD700",
        borderColor: "#FFA500",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
        gap: 10,
    },
    deliveredButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    pairButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    deleteButton: {
        backgroundColor: "#F44336",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        
    },
});


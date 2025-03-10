import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // ✅ Use FontAwesome from react-native-vector-icons
import MaterialIcon from "react-native-vector-icons/MaterialIcons"; // ✅ Use MaterialIcons from react-native-vector-icons
import moment from 'moment-timezone';

const DeliveryDetails = ({ businessDetails, deliveryDetails, users }) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");


  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleNavigation = () => {
    const query = `${deliveryDetails.address}, ${deliveryDetails.city}`;
    const encodedQuery = encodeURIComponent(query);
    const wazeUrl = `waze://?q=${encodedQuery}&navigate=yes`;

    Linking.canOpenURL(wazeUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(wazeUrl);
        } else {
          alert("Waze is not installed or cannot be opened.");
          const fallbackUrl = `https://www.waze.com/ul?q=${encodedQuery}&navigate=yes`;
          Linking.openURL(fallbackUrl).catch((err) =>
            console.error("Error opening fallback URL: ", err)
          );
        }
      })
      .catch((err) => console.error("Error with Linking API: ", err));
  };

  const getTime = (city) => {

    return businessDetails?.cities?.[city]?.time || null;
  };

  // Extract only the hour and minute part of the time
  const formattedTime = deliveryDetails.timestamp.split(" ")[1];

  // Convert time to a specific timezone and format it
  const timeInTimezone = moment
    .tz(`2025-01-11 ${formattedTime}`, "YYYY-MM-DD HH:mm:ss", "UTC")
    .add(2, "hours")
    .format("HH:mm:ss");

  const calculateTimeLeft = () => {
    const now = moment(); // Get the current time
    const deliveryTime = moment(timeInTimezone, "HH:mm:ss"); // Convert the string time to moment

    // Add the time offset (e.g., time from getTime function) to the deliveryTime
    const time = getTime(deliveryDetails.city); // Assume this returns time in minutes or hours
    const adjustedDeliveryTime = deliveryTime.add(time, 'minutes'); // You can adjust the unit (e.g., 'hours', 'minutes')

    // Calculate the duration between the adjusted delivery time and now
    const duration = moment.duration(adjustedDeliveryTime.diff(now));


    if (duration.asSeconds() <= 0) {
      return "מאחר";
    }

    return `${Math.floor(duration.asMinutes())} דקות`;
  };


  // useEffect to update timeLeft every minute
  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // Initial calculation

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval); // Cleanup when unmounting
  }, [timeInTimezone]);


  const getDeliverNameById = (uid) => {
    const user = users.find(user => user.uid === uid);
    return user ? user.name : ""; // Returns null if no user is found
  }

  if (!businessDetails) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => setPhoneModalVisible(true)}>
            <Icon name="phone" size={24} color="#4caf50" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigation}>
            <MaterialIcon name="navigation" size={24} color="#2196f3" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Icon name="picture-o" size={24} color="#f57c00" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.deliver}>
          <Text>{getDeliverNameById(deliveryDetails.deliver)}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Image source={{ uri: businessDetails.imageUrl }} style={styles.businessImage} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{deliveryDetails.address}</Text>
          <Text style={styles.text}>{deliveryDetails.city}</Text>
          <Text style={styles.text}>
            {typeof timeInTimezone === "string"
              ? `התקבל בשעה: ${timeInTimezone.substring(0, timeInTimezone.length - 3)}`
              : "No time"}
          </Text>
          {deliveryDetails.status ? (
            <Text style={styles.given}>נמסר</Text>
          ) : (
            <Text
              style={[
                styles.timeLeftText,
                timeLeft === "מאחר" && { color: "#FF0000" }, // ✅ Apply red color when late
              ]}
            >
              זמן שנותר: {timeLeft}
            </Text>
          )}
        </View>
      </View>



      {/* Modals */}
      {imageModalVisible && (
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <Image source={{ uri: deliveryDetails.imageUrl }} style={styles.modalImage} />
          </View>
        </Modal>
      )}

      {phoneModalVisible && (
        <Modal
          visible={phoneModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPhoneModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setPhoneModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.phoneListContainer}>
              {deliveryDetails.phones.map((phone, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.phoneButton}
                  onPress={() => handleCall(phone)}
                >
                  <Text style={styles.phoneText}>{phone}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,// Android shadow
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconsContainer: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: 10 },
  detailsContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  businessImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  textContainer: { justifyContent: "center" },
  text: { fontSize: 14, color: "#333", textAlign: "right" },
  timeLeftText: { fontSize: 14, color: "#7286D3", textAlign: "right", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    resizeMode: "contain",
    minWidth: 600,
    minHeight: 600,
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  closeText: { color: "#000", fontSize: 16 },
  phoneButton: {
    backgroundColor: "#4caf50",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  phoneText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  phoneListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  }, given: {
    fontSize: 14, color: "#0D9276", textAlign: "right", fontWeight: "bold"
  },
  leftContainer: {

    // padding: 10,
    backgroundColor: "#fff",
    // borderRadius: 10,
    // elevation: 2,
    alignItems: 'center',
    justifyContent: 'center'

  },
  deliver: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }


});

export default DeliveryDetails;

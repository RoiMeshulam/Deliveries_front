import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'; 

const Header = (props) => {
    const [currentTime, setCurrentTime] = useState("");

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
            setCurrentTime(formattedTime);
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup interval on unmount
    }, []);
    

    return (
            <View style={styles.container}>
                <Text style={styles.clock}>{currentTime}</Text>
                <Text style={styles.title}>{props.title}</Text>
            </View>      
    );
};

const styles = StyleSheet.create({
    
    container: {
        backgroundColor: "#fff", // Header background color
        alignItems: "center", // Center items horizontally
        justifyContent: "center", // Center items vertically
        borderBottomWidth: 1, // Optional border for separation
        borderBottomColor: "#ccc",
        paddingVertical: 10, // Adds vertical padding
        // paddingTop: 70
    },
    clock: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        padding: 5,
    },
    title: {
        fontSize: 26,
        color: "black",
        padding: 5, // Space between clock and title
    },
});

export default Header;

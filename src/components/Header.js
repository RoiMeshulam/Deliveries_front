import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = (props) => {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }); // 24-hour format
            setCurrentTime(formattedTime);
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup interval on unmount
    }, []);

    return (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.clock}>{currentTime}</Text>
                <Text style={styles.title}>{props.title}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 25 : 0, // Add top padding for Android status bar
        // paddingBottom: 10,
    },
    container: {
        alignItems: "center", // Center items horizontally
        justifyContent: "center", // Center items vertically
        borderBottomWidth: 1, // Optional border for separation
        borderBottomColor: "#ccc",
        // paddingVertical: 10, // Adds vertical padding
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

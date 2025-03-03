import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ Use react-native-vector-icons

const MyButton = ({ title, onPress, style, textStyle, iconName, iconSize = 20, iconColor = "#fff" }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <View style={styles.content}>
        {iconName && <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.icon} />}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8, // Adds space between icon and text
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

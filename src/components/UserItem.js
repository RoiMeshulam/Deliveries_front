import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function UserItem({ user }) {
  return (
    <View style={styles.userItem}>
      <Image source={{ uri: defaultAvatar }} style={styles.avatar} />
      <View>
        <Text style={styles.userText}>{user.name}</Text>
        <Text style={styles.roleText}>
          {user.role === "Admin" ? "מנהל" : "שליח"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  userText: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "bold",
  },
  roleText: {
    fontSize: 14,
    textAlign: "right",
    color: "gray",
  },
});

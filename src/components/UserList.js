import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import UserItem from "./UserItem";

export default function UsersList({ users }) {
  return (
    <View>
      <Text style={styles.subtitle}>שליחים</Text>
      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <UserItem user={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    textAlign: "right",
    marginRight: "3%",
  },
});

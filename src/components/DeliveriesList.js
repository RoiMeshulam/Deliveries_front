import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import DeliveryDetails from "./DeliveryDetails";

const DeliveriesList = ({ deliveries }) => {
  const renderItem = ({ item }) => (
    <DeliveryDetails
      businessImage={item.businessImage}
      address={item.address}
      city={item.city}
      time={item.time}
      onCall={item.onCall}
      onWaze={item.onWaze}
      onPreview={item.onPreview}
    />
  );

  return (
    <FlatList
      data={deliveries}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20, // For spacing at the bottom of the list
  },
});

export default DeliveriesList;

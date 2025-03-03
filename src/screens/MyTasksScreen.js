import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlobalStateContext } from "../contexts/GlobalStateContext";
import DisplayDeliveries from '../components/DisplayDeliveries';

export default function MyTasksScreen() {
  const { deliveries, userInfo } = useContext(GlobalStateContext);
  const [userDeliveries, setUserDeliveries] = useState([]);
  console.log(deliveries);

  useEffect(() => {
    if (deliveries.length === 0 || !userInfo) {
      return;
    } else {
      const filterDeliveries = deliveries.filter((item) => userInfo.uid === item.deliver && item.status === false);
      console.log("filterDeliveries", filterDeliveries);
      setUserDeliveries(filterDeliveries);
    }
  }, [deliveries, userInfo]); // Ensure dependencies are included
  

  if (userDeliveries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.noDeliveriesText}>אין משלוחים</Text>
      </View>
    )
  }else{
    return (
      <View style={styles.container}>
        <DisplayDeliveries deliveries={userDeliveries} userInfo={userInfo}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDeliveriesText: {
    fontSize: 24
  },
});

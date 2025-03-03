import React, { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlobalStateContext } from "../contexts/GlobalStateContext";
import DisplayDeliveries from "../components/DisplayDeliveries";
import FilterButtons from "../components/FilterButtons";

export default function TasksScreen() {
  const { deliveries, userInfo } = useContext(GlobalStateContext);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [filter, setFilter] = useState("הכל");
  const lastFilter = useRef("הכל");

  const categorizedDeliveries = {
    הכל: deliveries,
    אריאל: deliveries.filter((d) => !d.status && d.city === "אריאל"),
    חוצים: deliveries.filter((d) => !d.status && d.city !== "אריאל"),
    נמסר: deliveries.filter((d) => d.status),
  };

  const filterCounts = {
    הכל: deliveries.length,
    אריאל: categorizedDeliveries["אריאל"].length,
    חוצים: categorizedDeliveries["חוצים"].length,
    נמסר: categorizedDeliveries["נמסר"].length,
  };

  useEffect(() => {
    setFilteredDeliveries(categorizedDeliveries[lastFilter.current] || []);
  }, [deliveries]);

  const handleFilterChange = (selectedFilter) => {
    lastFilter.current = selectedFilter;
    setFilter(selectedFilter);
    setFilteredDeliveries(categorizedDeliveries[selectedFilter]);
  };

  if (deliveries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.noDeliveriesText}>אין משלוחים</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterButtons
        filter={filter}
        handleFilterChange={handleFilterChange}
        filterCounts={filterCounts}
      />
      <DisplayDeliveries deliveries={filteredDeliveries} userInfo={userInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDeliveriesText: {
    fontSize: 24,
  },
});


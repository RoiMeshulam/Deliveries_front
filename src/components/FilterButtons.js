import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FilterButtons = ({ filter, handleFilterChange, filterCounts }) => {
  const filters = ["נמסר", "חוצים", "אריאל", "הכל"];

  return (
    <View style={styles.container}>
      {filters.map((filterOption) => (
        <TouchableOpacity
          key={filterOption}
          style={[
            styles.button,
            filter === filterOption && styles.selectedButton,
          ]}
          onPress={() => handleFilterChange(filterOption)}
        >
          <Text
            style={[
              styles.text,
              filter === filterOption && styles.selectedText,
            ]}
          >
            {filterOption}
          </Text>
          <View style={styles.countCircle}>
            <Text style={styles.countText}>{filterCounts[filterOption]}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 3,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
  selectedButton: {
    backgroundColor: "#40A2E3",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  selectedText: {
    color: "#fff",
  },
  countCircle: {
    marginLeft: 8,
    backgroundColor: "#5F6F94",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FilterButtons;

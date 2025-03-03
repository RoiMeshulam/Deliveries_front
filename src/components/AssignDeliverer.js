import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

const AssignDeliverer = ({ users, assignDeliverer, modalVisible, setModalVisible }) => {
  return (
    <Modal transparent={true} visible={modalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>צימוד שליח</Text>
          {users
            .map((deliverer) => (
              <TouchableOpacity
                key={deliverer.uid}
                style={styles.modalButton}
                onPress={() => assignDeliverer(deliverer)}
              >
                <Text style={styles.modalButtonText}>{deliverer.name}</Text>  
              </TouchableOpacity>
            ))}
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>ביטול</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AssignDeliverer;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#78B3CE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
});

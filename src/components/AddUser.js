import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Platform, ActionSheetIOS } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AddUser({ modalVisible, setModalVisible, newUser, setNewUser, handleNewUserClick }) {
  const roles = [
    { label: "מנהל", value: "admin" },
    { label: "שליח", value: "worker" },
  ];

  const openIOSPicker = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...roles.map((r) => r.label), "ביטול"],
        cancelButtonIndex: roles.length,
      },
      (index) => {
        if (index < roles.length) {
          setNewUser({ ...newUser, role: roles[index].value });
        }
      }
    );
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>הוספת שליח חדש</Text>

          <Text style={styles.label}>שם השליח</Text>
          <TextInput
            style={styles.input}
            placeholder="שם השליח..."
            value={newUser.name}
            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
          />

          <Text style={styles.label}>תפקיד</Text>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity onPress={openIOSPicker} style={styles.iosPicker}>
              <Text style={styles.pickerText}>
                {roles.find((r) => r.value === newUser.role)?.label || "בחר תפקיד"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newUser.role}
                onValueChange={(itemValue) => setNewUser({ ...newUser, role: itemValue })}
                style={styles.picker}
              >
                {roles.map((r) => (
                  <Picker.Item key={r.value} label={r.label} value={r.value} />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.label}>אימייל</Text>
          <TextInput
            style={styles.input}
            placeholder="אימייל..."
            keyboardType="email-address"
            value={newUser.email}
            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
          />

          <Text style={styles.label}>סיסמה</Text>
          <TextInput
            style={styles.input}
            placeholder="...סיסמה"
            secureTextEntry
            value={newUser.password}
            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
          />

          <Text style={styles.label}>אימות סיסמה</Text>
          <TextInput
            style={styles.input}
            placeholder="...אימות סיסמה"
            secureTextEntry
            value={newUser.confirmPassword}
            onChangeText={(text) => setNewUser({ ...newUser, confirmPassword: text })}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>ביטול</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleNewUserClick}>
              <Text style={styles.buttonText}>שמור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay for better focus
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    alignSelf: 'flex-end',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    textAlign: 'right',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  iosPicker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#444',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#007AFF', // iOS blue
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  FlatList,
  KeyboardAvoidingView
} from 'react-native';
import { GlobalStateContext } from '../contexts/GlobalStateContext';
import AddUser from '../components/AddUser';
import DisplayBusinessesList from '../components/DisplayBusinessesList';
import axios from 'axios';
import UsersList from '../components/UserList';
import CustomAlert from '../components/styleComponents/CustomAlert';

const SOCKET_SERVER_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export default function StatsScreen() {
  const { users, businesses } = useContext(GlobalStateContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'worker',
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "", type: "" });

  const showCustomAlert = (title, message, type) => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  const resetForm = () => {
    setNewUser({ name: '', email: '', password: '', confirmPassword: '', role: 'Worker' });
  };

  const handleNewUserClick = async () => {
    if (newUser.password !== newUser.confirmPassword || newUser.name.length === 0 || newUser.email.length === 0 || newUser.password.length === 0) {
      showCustomAlert('הוספה נכשלה!', 'אנא מלא את כל השדות', "error");
      return;
    }
    try {
      await axios.post(`${SOCKET_SERVER_URL}/api/users/signup`, {
        email: newUser.email,
        name: newUser.name,
        password: newUser.password,
        role: newUser.role,
      });
      showCustomAlert("הוספת שליח חדש", `הנתונים של המשתמש החדש נשמרו בהצלחה!`, "success")
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to create new user:", error);
      Alert.alert("Error", "Failed to create new user.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <FlatList
        data={[{ key: 'users' }, { key: 'addUserButton' }, { key: 'businesses' }]}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.key === 'users') {
            return <UsersList users={users} />;
          } else if (item.key === 'addUserButton') {
            return (
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>הוספת שליח חדש +</Text>
              </TouchableOpacity>
            );
          } else if (item.key === 'businesses') {
            return <DisplayBusinessesList businesses={businesses} />;
          }
          return null;
        }}
        ListFooterComponent={
          <CustomAlert
            visible={alertVisible}
            title={alertData.title}
            message={alertData.message}
            onClose={() => setAlertVisible(false)}
            type={alertData.type}
          />
        }
      />
      
      <AddUser
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newUser={newUser}
        setNewUser={setNewUser}
        handleNewUserClick={handleNewUserClick}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: '5%', backgroundColor: "#f9f9f9" },
  addButton: { backgroundColor: "#003285", padding: 10, borderRadius: 8, marginTop: 10, alignItems: "center" },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

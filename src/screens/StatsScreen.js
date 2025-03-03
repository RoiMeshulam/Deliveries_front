import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  ScrollView
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
      
      <View contentContainerStyle={styles.scrollContainer}>
        {/* ✅ Set a max height for the UsersList */}
        <View style={styles.usersListContainer}>
          <UsersList users={users} />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>הוספת שליח חדש +</Text>
        </TouchableOpacity>

        <DisplayBusinessesList businesses={businesses} />

        <CustomAlert
          visible={alertVisible}
          title={alertData.title}
          message={alertData.message}
          onClose={() => setAlertVisible(false)}
          type={alertData.type}
        />
      </View>

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
  container: { 
    flex: 1, 
    paddingHorizontal: '5%', 
    backgroundColor: "#f9f9f9" 
  },
  scrollContainer: {
    flexGrow: 1, 
    paddingBottom: 20 
  },
  usersListContainer: {
    maxHeight: 270, // ✅ Sets max height for scrolling users list
    overflow: "hidden", // Prevents extra space from appearing
  },
  addButton: { 
    backgroundColor: "#003285", 
    padding: 10, 
    borderRadius: 8, 
    marginTop: 10, 
    alignItems: "center" 
  },
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});


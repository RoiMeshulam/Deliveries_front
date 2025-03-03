import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Image } from 'react-native';
import { GlobalStateContext } from '../contexts/GlobalStateContext';
import CustomAlert from '../components/styleComponents/CustomAlert';
import { signInWithEmail } from '../services/firebaseService'; // ✅ Import Firebase login function

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsConnected, setUserInfo } = useContext(GlobalStateContext);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "", type: "" });

  const showCustomAlert = (title, message, type) => {
    setAlertData({ title, message, type });
    setAlertVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Image above the title */}
      <Image source={require('../../assets/deliveryGuy.png')} style={styles.image} />

      <Text style={styles.heading}>Log In to Deliveries System</Text>

      <View style={styles.card}>
        {/* Labels above each TextInput */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <View style={styles.btn}>
          <Button title="Login" color="#008DDA" onPress={() => signInWithEmail(email, password, setIsConnected, setUserInfo, navigation, showCustomAlert)} />
        </View>
      </View>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertVisible}
        title={alertData.title}
        message={alertData.message}
        onClose={() => setAlertVisible(false)}
        type={alertData.type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20
  },
  image: {
    width: '100%',
    height: 120, // Adjust the height as needed
    resizeMode: 'contain',
    marginBottom: 20
  },
  heading: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#008DDA', 
    marginBottom: 40
  },
  card: { 
    width: '100%', 
    maxWidth: 400, 
    backgroundColor: '#fff', 
    padding: 30, 
    borderRadius: 8, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: { 
    borderWidth: 1, 
    width: '100%', 
    marginBottom: 15, 
    padding: 15, 
    borderRadius: 6,
    borderColor: '#ddd',
  },
  btn: { 
    alignSelf:'center',
    marginTop: 20, 
    width: '60%' 
  },
});

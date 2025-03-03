import { Platform, Alert, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 
Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

//auth
export const signInWithEmail = async (email, password, setIsConnected, setUserInfo, navigation, showCustomAlert) => {
    try {
      if (!email || !password) {
        showCustomAlert('התחברות נכשלה!', 'אנא מלא את כל השדות', "error");
        return;
      }
  
      // Firebase Authentication Login
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken(); // ✅ Get Firebase token
  
      // Send token to backend for verification
      const response = await axios.post(`${API_BASE_URL}/api/users/signin`, { token: idToken });
      const { token, uid, role, name } = response.data;
  
      // Store token locally
      await AsyncStorage.setItem('token', idToken);
  
      // Update global state
      setIsConnected(true);
      setUserInfo({ name, role, uid });
  
      // Show success message
      showCustomAlert("התחברת בהצלחה", `ברוך הבא! ${name}`, "success");
  
      // Navigate to the correct screen
      navigation.replace(role === "admin" ? 'AdminDashboard' : 'UserDashboard');
  
    } catch (error) {
      console.error("❌ Login Error:", error);
      showCustomAlert('Login Error', error.message || 'Login failed.', "error");
    }
  };

/**
 * Request notification permissions and get FCM token (Only for Android)
 */
export const requestUserPermission = async () => {
  if (Platform.OS !== 'android') {
    console.log("🚨 Skipping Firebase Messaging on iOS (No Dev Account)");
    return;
  }

  try {
    // Request POST_NOTIFICATIONS permission on Android 13+
    if (Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    // Request notification permissions
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("✅ Notification permission granted.");

      await messaging().registerDeviceForRemoteMessages(); // Register only on Android
      const token = await messaging().getToken();
      console.log("🔥 FCM Token:", token);
      return token;
    } else {
      console.log("🚫 Notification permission denied.");
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
  }
};

/**
 * Listen for foreground notifications (Only for Android)
 */
export const onMessageListener = () => {
  if (Platform.OS === 'android') {
    return messaging().onMessage(async remoteMessage => {
      Alert.alert('📩 New Notification', remoteMessage.notification?.body || 'No message body');
      console.log("📩 Foreground Notification:", remoteMessage);
    });
  }
};

/**
 * Handle background notifications (Only for Android)
 */
export const onBackgroundMessageListener = () => {
  if (Platform.OS === 'android') {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("📩 Background Notification:", remoteMessage);
    });
  }
};

/**
 * Handle app opening from a notification (Only for Android)
 */
export const onNotificationOpenedListener = () => {
  if (Platform.OS === 'android') {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("📩 App opened from background notification:", remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log("📩 App opened from quit state notification:", remoteMessage);
      }
    });
  }
};

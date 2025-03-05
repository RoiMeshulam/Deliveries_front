import { Platform, Alert, PermissionsAndroid } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const API_BASE_URL = 
Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

//auth
export const signInWithEmail = async (email, password, setIsConnected, setUserInfo, navigation, showCustomAlert, socket) => {
  try {
    if (!email || !password) {
      showCustomAlert('התחברות נכשלה!', 'אנא מלא את כל השדות', "error");
      return;
    }

    console.log("🔑 Signing in user...");
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken(); // ✅ Get Firebase token

    console.log("📡 Requesting FCM token...");
    const fcmToken = await requestUserPermission();

    // ✅ Send login token + FCM token to backend
    const response = await axios.post(`${API_BASE_URL}/api/users/signin`, { 
      token: idToken, 
      fcmToken: fcmToken || null  // ✅ Send `null` if FCM token is unavailable
    });

    const { token, uid, role, name } = response.data;

    await AsyncStorage.setItem('token', idToken); // ✅ Store token locally

    console.log(`✅ User logged in: ${name} (${role})`);
    setIsConnected(true);
    setUserInfo({ name, role, uid });

    showCustomAlert("התחברת בהצלחה", `ברוך הבא! ${name}`, "success");

    // ✅ Ensure WebSocket is initialized before emitting events
    if (socket) {
      console.log("🔌 Registering FCM token with WebSocket...");
      registerFcmTokenWithSocket(uid, fcmToken, socket);
    } else {
      console.warn("⚠️ WebSocket not initialized, skipping FCM registration.");
    }

    // ✅ Navigate **after** WebSocket registration
    navigation.replace(role === "admin" ? 'AdminDashboard' : 'UserDashboard');

  } catch (error) {
    console.error("❌ Login Error:", error);
    showCustomAlert('Login Error', error.message || 'Login failed.', "error");
  }
};


export const registerFcmTokenWithSocket = (userId, fcmToken, socket) => {
  if (!userId || !fcmToken || !socket) {
    console.warn("⚠️ Missing parameters: Cannot register FCM token.");
    return;
  }

  console.log(`📡 Registering FCM token for user ${userId}...`);
  socket.emit("registerFcmToken", fcmToken, (ack) => {
    if (ack?.success) {
      console.log("✅ FCM token registered successfully.");
    } else {
      console.error("❌ WebSocket registration failed.");
    }
  });

  // Handle WebSocket disconnects
  socket.on("disconnect", () => {
    console.warn("❌ WebSocket disconnected. FCM registration may be lost.");
  });
};

/**
 * Request notification permissions and get FCM token (Only for Android)
 */
export const requestUserPermission = async () => {
  if (Platform.OS !== 'android') {
    console.log("🚨 Skipping Firebase Messaging on iOS (No Dev Account)");
    return null;  // ✅ Return null if no token is needed
  }

  try {
    if (Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("✅ Notification permission granted.");
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log("🔥 FCM Token:", token);
      return token;  // ✅ Return the token
    } else {
      console.log("🚫 Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return null;
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

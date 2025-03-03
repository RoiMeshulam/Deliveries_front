import React, { useEffect } from 'react';
import { View, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

// 🔹 Background Notification Handler (Must be outside the component)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background Notification:', remoteMessage);
});

const App = () => {
  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        // Request POST_NOTIFICATIONS permission on Android 13+
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }

        // Request permission for push notifications
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Notification permission granted.');

          // Get FCM token for the device
          const token = await messaging().getToken();
          console.log('FCM Token:', token);

          // Log Firebase app name (ensuring Firebase is initialized)
          console.log('Firebase App Name:', firebase.app().name);
        } else {
          console.log('Notification permission denied.');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    };

    requestUserPermission();

    // Foreground notification listener
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notification', remoteMessage.notification?.body || 'No message body');
      console.log('Foreground Notification:', remoteMessage);
    });

    // Background & Quit State Notification Handler
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state notification:', remoteMessage);
        }
      });

    const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background notification:', remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeBackground();
    };
  }, []);

  return (
    <View>
      <Text>Welcome to My Firebase App</Text>
    </View>
  );
};

export default App;

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import {
  requestUserPermission,
  onMessageListener,
  onBackgroundMessageListener,
  onNotificationOpenedListener
} from './src/services/firebaseService';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  useEffect(() => {
    requestUserPermission();
    onMessageListener();
    onBackgroundMessageListener();
    onNotificationOpenedListener();
  }, []);

  return (
   <AppNavigator />
  );
};

export default App;

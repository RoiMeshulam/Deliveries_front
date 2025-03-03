import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import {
  requestUserPermission,
  onMessageListener,
  onBackgroundMessageListener,
  onNotificationOpenedListener
} from './src/services/firebaseService';
import LoginScreen from './src/screens/LoginScreen';
import { GlobalStateProvider } from './src/contexts/GlobalStateContext';

const App = () => {
  useEffect(() => {
    requestUserPermission();
    onMessageListener();
    onBackgroundMessageListener();
    onNotificationOpenedListener();
  }, []);

  return (
    <GlobalStateProvider>  
    <LoginScreen />
  </GlobalStateProvider>
  );
};

export default App;

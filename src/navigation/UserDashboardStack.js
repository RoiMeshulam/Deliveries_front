import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native';
import MyTasksScreen from '../screens/MyTasksScreen';
import Header from '../components/Header';
import { GlobalStateContext } from '../contexts/GlobalStateContext';

const Stack = createNativeStackNavigator();

export default function UserDashboardStack() {
  const { loading } = useContext(GlobalStateContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="המשלוחים שלי"
        component={MyTasksScreen}
        options={{ header: () => <Header title="המשלוחים שלי" /> }}
      />
    </Stack.Navigator>
  );
}

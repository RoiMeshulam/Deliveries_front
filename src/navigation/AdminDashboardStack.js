import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text } from 'react-native';
import TasksScreen from '../screens/TasksScreen';
import MyTasksScreen from '../screens/MyTasksScreen';
import StatsScreen from '../screens/StatsScreen';
import Header from '../components/Header';
import { GlobalStateContext } from '../contexts/GlobalStateContext';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ Import Ionicons

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TasksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function AdminDashboardStack() {
  const { loading } = useContext(GlobalStateContext); // Get loading state from context

  // Show a loading spinner if the data is being fetched
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#FBFBFB' }, // Set background color
        tabBarActiveTintColor: '#003285', // Active icon color
        tabBarInactiveTintColor: 'grey', // Inactive icon color
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Set icons based on the route name
          if (route.name === 'כל המשלוחים') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'עסקים ושליחים') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'המשלוחים שלי') {
            iconName = focused ? 'bicycle' : 'bicycle-outline';
          }

          // Return the Ionicons component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="כל המשלוחים"
        component={TasksStack}
        options={{ header: () => <Header title="כל המשלוחים" /> }}
      />
      <Tab.Screen
        name="עסקים ושליחים"
        component={StatsScreen}
        options={{ header: () => <Header title="עסקים ושליחים" /> }}
      />
      <Tab.Screen
        name="המשלוחים שלי"
        component={MyTasksScreen}
        options={{ header: () => <Header title="המשלוחים שלי" /> }}
      />
    </Tab.Navigator>
  );
}

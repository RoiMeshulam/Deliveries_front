import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import UserDashboardStack from './UserDashboardStack';
import AdminDashboardStack from './AdminDashboardStack';
import { GlobalStateProvider } from '../contexts/GlobalStateContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <GlobalStateProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Auth">
                    <Stack.Screen
                        name="Auth"
                        component={AuthStack}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AdminDashboard"
                        component={AdminDashboardStack}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="UserDashboard"
                        component={UserDashboardStack}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GlobalStateProvider>
    );
}

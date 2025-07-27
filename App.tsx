import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FoodLogScreen from './src/screens/FoodLogScreen';
import { CalorieProvider } from './src/context/CalorieContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CalorieProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1a1a2e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerShown: false,
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="FoodLog" component={FoodLogScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </CalorieProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 
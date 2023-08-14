import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/login';
import HomeScreen from '../screens/home';

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>

      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}


export default StackNavigator;

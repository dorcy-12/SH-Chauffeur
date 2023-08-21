import React from "react";
import { createStackNavigator, createBottomTabNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";
import MainTabs from "./MainTabs";
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;

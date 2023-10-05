import React from "react";
import { createStackNavigator, createBottomTabNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";
import MainTabs from "./MainTabs";
import MapScreen from "../screens/MapScreen";
import DrivingTimerScreen from "../screens/DrivingTimerScreen";
const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="Timer"
        component={DrivingTimerScreen}
        options={{ headerShown: false }}
      />
      
      
    </Stack.Navigator>
  );
}

export default StackNavigator;

import React from "react";
import { createStackNavigator, createBottomTabNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";
import MainTabs from "./MainTabs";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import DrivingTimerScreen from "../screens/DrivingTimerScreen";
import JourneyDetailsScreen from "../screens/JourneyDetails";
import ServiceDetailCard from "../Components/ServiceDetailCard";
import AdminHomeScreen from "../screens/EmployeeListScreen";
import EmployeeListScreen from "../screens/EmployeeListScreen";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceDetailScreen"
        component={ServiceDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Timer"
        component={DrivingTimerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Journey"
        component={JourneyDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="employeeList"
        component={EmployeeListScreen}
        options={{ headerShown: false }}
      />
    
      
      
    </Stack.Navigator>
  );
}

export default StackNavigator;

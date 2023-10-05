import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";

const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;

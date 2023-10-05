import React, { useState, useEffect, useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigator from "./AuthNavigator";
import MainTabs from "./MainTabs";
import { getToken } from "../service/authservice"; // Assuming you add the checkToken function to authservice
import { AuthContext } from "../context/UserAuth";

const Stack = createStackNavigator();

function RootNavigator() {
  const { isUserLoggedIn } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isUserLoggedIn ? (
        <Stack.Screen name="MainApp" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;

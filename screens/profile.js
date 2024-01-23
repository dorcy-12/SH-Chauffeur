import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

import { logoutUser } from "../service/authservice";
import { AuthContext } from "../context/UserAuth";
import { deleteUserFirebaseTokens } from "../service/authservice";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfile, getUsers, wipeMessagesTable, getLocalMessages } from "../database";

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {
    setIsUserLoggedIn,
    userId,
    channels,
    password,
    setUserId,
    setEmployeeId,
    employeeId,
    setEmployeeName,
    setPassword,
    setChannels,
  } = useContext(AuthContext);

  const handleLogout = async () => {
    //await wipeMessagesTable();
    await deleteUserFirebaseTokens("userId");
    await SecureStore.deleteItemAsync("userId");
    await SecureStore.deleteItemAsync("password");
    await SecureStore.deleteItemAsync("employeeId");
    await AsyncStorage.removeItem("token");
    //await AsyncStorage.removeItem("channels");
    setUserId(null);
    setChannels(null);
    setEmployeeId(null);
    setEmployeeName(null);
    setPassword(null);
    setIsUserLoggedIn(false);
   
    // Clear other sensitive data as needed
    
  };

  const [profileData, setProfileData] = useState({
    name: "", // Default empty name
    imageUri: "https://placebeard.it/640x360", // Default image URL
    email: "",
  });

  useEffect(() => {
    const fetchAndSetUserProfile = async () => {
      try {
        
        const userProfile = await getUserProfile(employeeId);
      
        
        if (userProfile) {
          setProfileData({
            name: userProfile.name,
            imageUri: `data:image/png;base64,${userProfile.profile_picture}`,
            email: userProfile.email,
          });
        }
        
      } catch (error) {
        console.error("Error fetching user profile: ", error);
        Alert.alert("Error fetching user profile: ", error);
      }
    };

    if (userId) {
      fetchAndSetUserProfile();
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: profileData.imageUri }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{profileData.name}</Text>
        <Text style={styles.profileEmail}>{profileData.email}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.tertiary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    profileName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 5,
    },
    profileEmail: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 30,
    },
    logoutButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      backgroundColor: theme.secondary,
    },
    logoutText: {
      color: theme.tertiary,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default ProfileScreen;

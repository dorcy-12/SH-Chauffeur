import React, {useContext,useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

import { logoutUser} from '../service/authservice';
import { AuthContext } from '../context/UserAuth';
import { fetchEmployeeProfile,deleteUserFirebaseTokens } from "../service/authservice";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { setIsUserLoggedIn, userId, password, setUserId,setEmployeeId, setPassword } = useContext(AuthContext);

    const handleLogout = async () => {
      await deleteUserFirebaseTokens("userId");
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("employeeProfile");
      await AsyncStorage.removeItem("token");
      setUserId(null);
      setEmployeeId(null), 
      setPassword(null),
      setIsUserLoggedIn(false);
      // Clear other sensitive data as needed
    };
    

    const [profileData, setProfileData] = useState({
      name: '', // Default empty name
      imageUri: 'https://placebeard.it/640x360', // Default image URL
      email: '',
    });
  
    useEffect(() => {
      const fetchAndSetUserProfile = async () => {
        console.log(userId);
        const userProfile = await fetchEmployeeProfile(userId, password);
        console.log(userProfile);
        if (userProfile) {
          setProfileData({
            name: userProfile.name,
            imageUri: `data:image/png;base64,${userProfile.profilePicture}`,
            email: userProfile.work_email,
          });  
        }
      };
  
      fetchAndSetUserProfile();
    }, []);
    
   
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
  

  const createStyles = (theme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.tertiary,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
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
      fontWeight: 'bold',
    },
  });
  
  export default ProfileScreen;
  
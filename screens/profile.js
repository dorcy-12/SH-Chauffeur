import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Footer from '../Components/footer';
const ProfileScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);
  
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={{ uri: 'https://placebeard.it/640x360' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={() => {
            // Add logout functionality here
          }}>
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
  
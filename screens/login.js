import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import fetchLoginDetails from "../service/authservice";



function LoginScreen({ navigation }) {
  const [employeeId, setEmployeeId] = useState("");
  const [pin, setPin] = useState("");
  const [isPinVisible, setIsPinVisible] = useState(false);

  const handleLogin = async () => {
    try {
      // Call the service to fetch login details
      const loginDetails = await fetchLoginDetails(employeeId, pin);

      // Assuming loginDetails contains a token upon successful login
      const token = loginDetails.token;

      // Handle successful login (e.g., store the token in AsyncStorage, navigate to the main screen)
      // For simplicity, we'll just log the token
      console.log("Login successful! Token:", token);

      // Navigate to the 'Main' screen (you may want to replace this with your actual navigation logic)
      navigation.navigate("Main");
    } catch (error) {
      // Handle login error
      console.error("Error during login:", error.message);
      // You can show an error message to the user if needed
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo-no.png")} style={styles.logo} />
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Fahrer-Nr"
            value={employeeId}
            onChangeText={setEmployeeId}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry={!isPinVisible}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.pinToggle}
            onPress={() => setIsPinVisible(!isPinVisible)}
          >
            <Feather name={isPinVisible ? "eye-off" : "eye"} size={24} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
  },
  form: {
    width: "85%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E0E0E0",
    marginBottom: 15,
    backgroundColor: "white",
  },
  pinToggle: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }], // assuming half the size of the icon
  },
  input: {
    flex: 1,
    padding: 12,
    paddingRight: 40, // to ensure text doesn't overlap with the icon
  },
  loginButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#3498db",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LoginScreen;

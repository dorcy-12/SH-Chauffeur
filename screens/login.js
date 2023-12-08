import React, { useState, useContext, useEffect} from "react";
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
import {
  loginUser,
  logoutUser,
  fetchEmployeeProfile,
} from "../service/authservice";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/UserAuth";

function LoginScreen({ navigation }) {
  const [Id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [isPinVisible, setIsPinVisible] = useState(false);
  const {
    setIsUserLoggedIn,
    setUserId,
    userId,
    employeeId,
    setEmployeeId,
    password,
    setPassword,
  } = useContext(AuthContext);


  const handleLogin = async () => {
    try {
      const uid = await loginUser(Id, pin); // Replace with appropriate arguments
      if (uid) {
        const employeeProfile = await fetchEmployeeProfile(uid,pin);
        setUserId(uid);
        setEmployeeId(employeeProfile.id)
        setPassword(pin);
        if (employeeProfile && userId && password) {
          console.log(userId);
          setIsUserLoggedIn(true);
      
          console.log("we are in " + password); 
        }
        else{
          console.log("employee profile not found");
        }
      } else {
        console.log(userId);
        console.log("we are not in");
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };
  useEffect(() => {
    console.log("Password updated in context:", password);
  }, [password]);

  useEffect(() => {
    console.log("userId updated in context:", userId);
  }, [userId]);
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/logo-no.png")} style={styles.logo} />
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Fahrer-Nr"
            value={Id}
            onChangeText={setId}
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

import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  loginUser,
  logoutUser,
  fetchEmployeeProfile,
  uploadFirebaseToken,
  fetchPartnerId,
  getDiscussChannels,
} from "../service/authservice";
import { AuthContext } from "../context/UserAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { insertUser, insertChannel } from "../database";

function LoginScreen({ navigation }) {
  const [Id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    setIsUserLoggedIn,
    setUserId,
    setEmployeeId,
    setPassword,
    setChannels,
    channels,
    setPartnerId,
  } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const fcmtoken = await AsyncStorage.getItem("token");
      const uid = await loginUser(Id, pin);

      if (uid) {
        // Execute fetchEmployeeProfile and fetchPartnerId in parallel
        const employeeProfilePromise = fetchEmployeeProfile(uid, pin);
        const partnerIdPromise = fetchPartnerId(uid, pin);

        // Await all promises
        const [{ id, name, image_1920, work_email }, partnerId] =
          await Promise.all([employeeProfilePromise, partnerIdPromise]);

        if (partnerId) {
          setUserId(uid);
          setEmployeeId(id);
          setPassword(pin);
          setPartnerId(partnerId);
          // Further parallel operations
          
          const uploadTokenPromise = uploadFirebaseToken(
            partnerId,
            fcmtoken,
            uid,
            pin
          );
          const fetchChannelsPromise = getDiscussChannels(uid, partnerId);

          // Await all promises
          const [uploadResult, channels] = await Promise.all([
            uploadTokenPromise,
            fetchChannelsPromise,
          ]);
          console.log("Firebase token uploaded. Record ID:", uploadResult);

          if (channels) {
            const userInsertPromise = insertUser(
              uid,
              id,
              partnerId,
              name,
              work_email,
              image_1920
            );
            const channelInsertPromises = channels.map((channel) =>
              insertChannel(channel.id, channel.name, channel.description, channel.channel_type)
            );

            // Combine all promises
            const allInsertPromises = [
              userInsertPromise,
              ...channelInsertPromises,
            ];

            // Await all insert operations
            try {
              await Promise.all(allInsertPromises);

              setIsUserLoggedIn(true);
              console.log("loogged in");
            } catch (error) {
              // Handle any errors that occurred during insert operations
              console.error("Error during insert operations: ", error);
            }
          }
        } else {
          Alert.alert("Failed to retrieve partner ID");
        }
      } else {
        Alert.alert("Authentication failed");
      }
    } catch (error) {
      Alert.alert("Login error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../assets/loading.json")}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
      ) : (
        <>
          <Image
            source={require("../assets/logo-no.png")}
            style={styles.logo}
          />
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
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottieAnimation: {
    width: 200, // Set the size as needed
    height: 200, // Set the size as needed
  },
});

export default LoginScreen;

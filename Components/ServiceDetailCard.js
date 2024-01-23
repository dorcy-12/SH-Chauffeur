import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useService } from "../context/ServiceContext";
import { AuthContext } from "../context/UserAuth";
import {
  createEmployeeCheckIn,
  changeServiceState,
} from "../service/authservice";
const ServiceDetailCard = ({ service }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { userId, employeeId, password } = useContext(AuthContext);
  const styles = createStyles(theme);

  if (!service) return null;
  console.log(service);

  const handlenavigation = async () => {
    console.log("userId is" + userId + "employeeId is" + employeeId);
    const checkin = await createEmployeeCheckIn(employeeId, userId, password);
    console.log("check in " + checkin);
    const state = await changeServiceState(
      userId,
      service.id,
      "running",
      password
    );
    console.log("serviceid " + service.id);
    console.log("check state" + state);
    console.log("employeeId " + employeeId);
    console.log("userId " + userId);
    console.log("password " + password);

    console.log(state);
    if (checkin && state) {
      console.log("check in " + checkin);
      console.log("serviceid " + service.id);
      console.log("check state" + state);
      navigation.navigate("Timer", {
        checkinId: checkin,
        serviceId: service.id,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Dein Fahrt</Text>
        <Text style={styles.highlightedDetail}>
          Auto: {service.vehicle_id[1]}
        </Text>
        <Text style={styles.highlightedDetail}>Datum: {service.date}</Text>

        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.highlightedDetail}>Fahrer: </Text>
          <Text>{service.purchaser_id[1]}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.highlightedDetail}>Ort:</Text>
          <Text style={[styles.detail, { marginLeft: 5 }]}>
            {service.description}
          </Text>
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notizen:</Text>
          <TextInput
            style={styles.notesTextInput}
            multiline // Allows multiple lines
            editable={false} // Makes it non-editable
            value={service.notes ? service.notes : ""}
          />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handlenavigation}
        >
          <Text style={{ fontWeight: "700", color: "white" }}>
            Jetzt Fahren
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container:{
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    },
    card: {
      //flex: 1,
      borderRadius: 10,
      padding: 20,
      backgroundColor: theme.tertiary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 5,
      //alignSelf: "center",
      width: "80%",
      height: "60%",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 15,
    },
    highlightedDetail: {
      fontSize: 18,
      fontWeight: "bold", // Bold to highlight
      color: theme.text,
      marginBottom: 10,
    },
    detail: {
      fontSize: 16,
      color: theme.secondaryText,
      marginBottom: 10,
    },
    notesContainer: {
      flex: 1, // Flex to take up available space
      marginTop: 10,
    },
    notesTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 5,
    },
    notesScroll: {
      maxHeight: 100, // Limit height with a scroll view
    },
    notesText: {
      fontSize: 16,
      color: theme.text,
    },
    buttonContainer: {
      backgroundColor: theme.primary,
      padding: 10,
      alignItems: "center",
      borderRadius: 12,
    },
    notesTextInput: {
      fontSize: 16,
      color: theme.text,
      backgroundColor: "#f0f0f0", // Optional: add a background color
      borderRadius: 5, // Optional: add rounded corners
      padding: 10, // Optional: add padding
      // Add any other styling you want for the TextInput
    },
  });

export default ServiceDetailCard;

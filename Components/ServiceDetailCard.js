import React, { useContext } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
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
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={styles.highlightedDetail}>Auto: </Text>
        <Text style={styles.detail}>{service.vehicle_id[1]}</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={styles.highlightedDetail}>Datum: </Text>
        <Text style={styles.detail}>{service.date}</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={styles.highlightedDetail}>Fahrer: </Text>
        <Text style={styles.detail}>{service.purchaser_id[1]}</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={styles.highlightedDetail}>Status: </Text>
        <Text style={styles.detail}>{service.state}</Text>
      </View>
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Notizen: </Text>
        <ScrollView style={styles.notesScroll}>
          <Text style={styles.notesText}>{service.notes}</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Jetzt fahren" onPress={handlenavigation} />
      </View>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 10,
      padding: 20,
      backgroundColor: theme.tertiary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 5,
      marginHorizontal: 10,
      minHeight: 400, // Adjust as needed
      width: "100%",
      alignSelf: "center",
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
    },
    detail: {
      fontSize: 16,
      color: theme.secondaryText,
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
      maxHeight: 200, // Limit height with a scroll view
      backgroundColor: "#ccc",
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 10,
    },
    notesText: {
      fontSize: 16,
      color: theme.text,
    },
    buttonContainer: {
      marginTop: 10,
    },
  });

export default ServiceDetailCard;

import React, { useContext } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useService } from "../context/ServiceContext";
import { AuthContext } from "../context/UserAuth";
import {createEmployeeCheckIn, changeServiceState} from "../service/authservice";
const ServiceDetailCard = ({ service }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { userId, employeeId, password } = useContext(AuthContext);
  const styles = createStyles(theme);

  if (!service) return null;
  console.log(service);

  const handlenavigation = async () => {
    console.log("userId is" + userId +"employeeId is" + employeeId)
    const checkin = await createEmployeeCheckIn(employeeId, userId, password );
    console.log("check in " + checkin)
    const state = await changeServiceState(userId, service.id, "running", password );  
    console.log("serviceid " + service.id) 
    console.log("check state" + state)
    console.log("employeeId " + employeeId)
    console.log("userId " + userId)
    console.log("password " + password)

    console.log(state);
    if (checkin && state){
      console.log("check in " + checkin)
      console.log("serviceid " + service.id) 
      console.log("check state" + state)
      navigation.navigate("Timer", {"checkinId": checkin, "serviceId":service.id });
    }
   
  };
  

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{service.service_type_id[1]}</Text>
      <Text style={styles.highlightedDetail}>
        Vehicle: {service.vehicle_id[1]}
      </Text>
      <Text style={styles.detail}>Date: {service.date}</Text>
      <Text style={styles.highlightedDetail}>
        Purchaser: {service.purchaser_id[1]}
      </Text>
      <Text style={styles.detail}>State: {service.state}</Text>

      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Notes:</Text>
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
      marginTop: 30,
      marginBottom: 20,
      // Adjust the height for a longer card
      minHeight: 300, // Adjust as needed
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
      position: "absolute",
      right: 20,
      bottom: 20,
    },
  });

export default ServiceDetailCard;

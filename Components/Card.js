import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useTheme } from "../context/ThemeContext";

const Card = ({ vehicleName, serviceType, serviceDate,description }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Ionicons name="car-sport" size={18} color={theme.tertiary} />
        <Text style={styles.vehicleName}>{vehicleName}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.serviceInfo}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.dateWrapper}>
          <Ionicons name="calendar" size={18} color={'gray'} />
          <Text style={styles.serviceDate}>{serviceDate}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    width: "90%",
    borderRadius: 10,
    backgroundColor: theme.tertiary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    marginBottom: 20,
    overflow: "hidden",
    alignSelf: "center"
  },
  descriptionText: {
    fontSize: 14,
    color: theme.text,
    marginVertical: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.primary,
    padding: 8,
  },
  vehicleName: {
    marginLeft: 5,
    flex: 1,
    color: theme.primaryText,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 10
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  serviceType: {
    marginLeft: 5,
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  separator: {
    height: 1,
    backgroundColor: "lightgray",
    marginVertical: 10,
    opacity: 0.5,
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceDate: {
    marginLeft: 5,
    color: 'gray',
  },
});
export default Card;


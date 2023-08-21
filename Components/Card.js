import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useTheme } from "../context/ThemeContext";

const Card = ({ number, time, date, location }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Ionicons name="location-sharp" size={18} color={theme.tertiary} />
        <Text style={styles.locationText}>{location}</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color={theme.tertiary} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardNumber}>
          <Ionicons name="car" size={35} color={theme.secondary} />
          <Text style={styles.carNumber}>{number}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.timeDateContainer}>
          <View style={styles.timeWrapper}>
            <Ionicons name="alarm-outline" size={18} color={'red'} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <View style={styles.dateWrapper}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: theme.primary,
    padding: 8,
  },
  locationText: {
    marginLeft: 5,
    flex: 1,
    color: theme.primaryText,
  },
  cardNumber: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  carNumber: {
    marginLeft: 5,
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color:"black",
  },
  separator: {
    height: 1,
    backgroundColor: "lightgray",
    marginVertical: 10,

    opacity: 0.5,
  },
  cardContent:{
    padding: 10
  },
  timeDateContainer: {
    flexDirection: "row",
  },
  timeWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    marginLeft: 5,
    color: 'red',
  },
  dateText: {
    marginLeft: 15,
    right: 0,
    color: 'gray',
  },
});

export default Card;


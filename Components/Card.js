import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you use Expo

const Card = ({ number, time, date, location }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Ionicons name="location-sharp" size={18} color="black" />
        <Text style={styles.locationText}>{location}</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
      </View>
      <View style = {styles.cardContent}>
        <View style={styles.cardNumber}>
          <Ionicons name="location-sharp" size={18} color="black" />
          <Text style={styles.carNumber}>{number}</Text>
        </View>


        <View style={styles.separator} />

        <View style={styles.timeDateContainer}>
          <View style={styles.timeWrapper}>
            <Ionicons name="location-sharp" size={18} color="black" />
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

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    marginBottom: 20,
    overflow: "hidden",
    //padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#e0e0e0", // Placeholder color, adjust as needed
    padding: 8,
  },
  locationText: {
    marginLeft: 5,
    flex: 1,
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
  },
  separator: {
    height: 1,
    backgroundColor: "lightgray",
    marginVertical: 10,
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
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    marginLeft: 5,
  },
  dateText: {
    marginLeft: 15,
    right: 0,
  },
});

export default Card;

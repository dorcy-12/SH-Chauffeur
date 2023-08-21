import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from "@expo/vector-icons";

const TripCard = ({ trip }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="car" size={40} color={theme.secondary} />
        <Text style={styles.carNumber}>{trip.carNumber}</Text>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.detailsContainer}>
        <View style={styles.timeDetailRow}>
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={16} color={theme.secondary} />
            <Text style={styles.detail}>Start: {trip.startTime}</Text>
          </View>
          <Text style={styles.detail}>End: {trip.endTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={theme.secondary} />
          <Text style={styles.detail}>Date: {trip.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="speedometer" size={16} color={theme.secondary} />
          <Text style={styles.detail}>Kilometers: {trip.kilometers}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      margin: 12,
      padding: 20,
      elevation: 2,
      width: '90%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      //justifyContent: 'space-between',
      marginBottom: 15,
    },
    carNumber: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
      marginLeft: 10
    },
    carType: {
      fontSize: 18,
      color: theme.secondary,
      fontStyle: 'italic',
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.secondary,
      opacity: 0.6,
      marginVertical: 10,
    },
    detailsContainer: {
      marginTop: 10,
    },
    timeDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    detail: {
      marginLeft: 10,
      fontSize: 16,
      color: theme.text,
    },
    icon: {
      color: theme.primary,
    }
  });
  
  
  
  
export default TripCard;

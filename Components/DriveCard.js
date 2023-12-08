import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Ensure you have this dependency

const DriveCard = ({ drive }) => {
  const cardStyle = drive.state === "done" ? styles.successCard : styles.failureCard;
  const iconName = drive.state === "done" ? "check-circle" : "cancel";

  return (
    <View style={[styles.card, cardStyle]}>
      <View style={styles.header}>
        <MaterialIcons name={iconName} size={24} color={drive.state === "done" ? "#28a745" : "#dc3545"} />
        <Text style={styles.dateText}>{drive.date}</Text>
      </View>
      <Text style={styles.destinationText}>{drive.description}</Text>
      <Text style={styles.statusText}>{drive.state.toUpperCase()}</Text>
    </View>
  ); 
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  successCard: {
    borderColor: '#28a745',
    borderWidth: 1,
  },
  failureCard: {
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  destinationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'right',
  },
});

export default DriveCard;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DriveCard = ({ drive }) => {
  const cardStyle = drive.status === 'successful' ? styles.successCard : styles.failureCard;

  return (
    <View style={[styles.card, cardStyle]}>
      <Text style={styles.dateText}>{drive.date}</Text>
      <Text style={styles.destinationText}>{drive.destination}</Text>
      <Text style={styles.statusText}>{drive.status.toUpperCase()}</Text>
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
  },
  successCard: {
    backgroundColor: '#d4edda', // Light green for success
  },
  failureCard: {
    backgroundColor: '#f8d7da', // Light red for failure
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
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

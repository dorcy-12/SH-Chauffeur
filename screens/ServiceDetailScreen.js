import React from "react";
import { View, StyleSheet } from "react-native";
import { useService } from "../context/ServiceContext";
import ServiceDetailCard from "../Components/ServiceDetailCard"; // Import the detail card component
import { useTheme } from "../context/ThemeContext";

const ServiceDetailsScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { activeService } = useService();

  return (
    <View style={styles.container}>
      <ServiceDetailCard service={activeService} />
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center", // Aligns children vertically in the middle
      paddingHorizontal: 20, // Aligns children horizontally in the middle
      backgroundColor: theme.secondary, // Add padding to prevent the card from touching the screen edges
    },
  });

export default ServiceDetailsScreen;

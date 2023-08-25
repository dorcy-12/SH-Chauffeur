import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Card from "../Components/Card";
import { useTheme } from "../context/ThemeContext";

function HomeScreen({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dienstplan</Text>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate("Map", {location: "Frankfurt am Main"})}>
          <Card
            number="SH 302"
            location="Frankfurt am Main"
            time="8:30"
            date="Heute"
          />
        </TouchableOpacity>
        {/* Add more cards as needed */}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F8F9",
      paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    },

    image: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    header: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      // Add any other styling
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      // Add any other styling
    },
  });
export default HomeScreen;

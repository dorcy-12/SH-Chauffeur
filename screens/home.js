import React from "react";
import { StyleSheet, Text, View, Image, Button, Platform, SafeAreaView, StatusBar } from "react-native";
import Card from "../Components/Card";

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dienstplan</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Card
          number="SH 302"
          location= "Frankfurt am Main"
          time = "8:30"
          date = "Heute"
        />
        {/* Add more cards as needed */}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer Information</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight: 0
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
  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // Add any other styling
  },
  footerText: {
    fontSize: 18,
  },
});
export default HomeScreen;

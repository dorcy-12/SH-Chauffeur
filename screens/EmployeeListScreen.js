import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { getUsers } from "../database";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

function EmployeeListScreen({route, navigation}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // Options: "all", "active", "inactive"

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearchTerm = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearchTerm;
    if (filter === "active")
      return matchesSearchTerm && employee.attendance_state === "checked_in";
    if (filter === "inactive")
      return matchesSearchTerm && employee.attendance_state !== "checked_in";
    return false;
  });
  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };
  useEffect(() => {
    setIsLoading(true);
    getUsers()
      .then((data) => {
        setEmployees(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching employees: ", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Check if the filter parameter is passed
    if (route.params && route.params.filter) {
      setFilter(route.params.filter); // Set the filter based on the parameter
    }

    // ... existing code for fetching employees ...
  }, [route.params]);
  const renderAttendanceStatus = (status) => {
    if (status === "checked_in") {
      return <Fontisto name="radio-btn-active" size={18} color="green" />;
    } else if (status === "checked_out") {
      return <Fontisto name="radio-btn-active" size={18} color="red" />;
    } else {
      return null;
    }
  };
  const getTitle = () => {
    switch (filter) {
      case "active":
        return "Active Employees";
      case "inactive":
        return "Inactive Employees";
      default:
        return "All Employees";
    }
  };

  const handleFilter = (option) => {
    setFilter(option);
    setShowFilter(false);
  };
  const FilterSelectionModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showFilter}
      onRequestClose={() => setShowFilter(!showFilter)}
    >
      <View style={styles.filterModalView}>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => handleFilter("all")}
        >
          <Text style={styles.filterOptionText}> All Employees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => handleFilter("active")}
        >
          <Text style={styles.filterOptionText}>Active Employees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => handleFilter("inactive")}
        >
          <Text style={styles.filterOptionText}>Inactive Employees</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
  const ShowEmployeeDetails = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Employee Details</Text>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Name: {selectedEmployee?.name}</Text>
            <Text style={styles.modalText}>
              Email: {selectedEmployee?.email}
            </Text>
            <Text style={styles.modalText}>
              Phone: {selectedEmployee?.mobile_phone}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => openModal(item)}
    >
      <View style={styles.row}>
        <Text style={styles.item}>{item.name}</Text>
        <View style={styles.radio}>
          {renderAttendanceStatus(item.attendance_state)}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text> // Replace with a loading animation if desired
      ) : (
        <>
          <View style={styles.titleBar}>
            <Text style={styles.screenTitle}>{getTitle()}</Text>
          </View>
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <AntDesign name="search1" size={18} color="#aaa" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search employees"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowFilter(true);
              }}
            >
              <AntDesign name="filter" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ShowEmployeeDetails />
          <FilterSelectionModal />
          <View style={styles.tableHeader}>
            <Text
              style={[
                styles.column,
                { borderRightWidth: 1, borderRightColor: "white" },
              ]}
            >
              Name
            </Text>
            <Text style={styles.column}>Status</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
            <FlatList
              data={filteredEmployees}
              renderItem={renderItem}
              keyExtractor={(item) => item.employee_id.toString()}
            />
          </TouchableWithoutFeedback>
        </>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    },
    itemContainer: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    item: {
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 10, // Add some horizontal padding to columns
      width: "50%",
    },
    radio: {
      flex: 1,
      width: "50%",
      alignItems: "center",
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonClose: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15,
    },
    searchInput: {
      marginLeft: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
    modalContent: {
      marginVertical: 20,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
    searchBar: {
      flexDirection: "row",
      marginVertical: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      alignItems: "center",
      alignSelf: "center",
      width: "70%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    filterModalView: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

    filterOption: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: "100%",
      alignItems: "center",
    },

    filterOptionText: {
      fontSize: 18,
      color: "#333",
    },
    titleBar: {
      marginTop: 30,
      paddingHorizontal: 30,
      //alignItems: "center",
      justifyContent: "center",
      //backgroundColor: "#f2f2f2", // Adjust the background color as needed
    },
    screenTitle: {
      fontSize: 22,
      fontWeight: "bold",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.primary,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    column: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: "white",
      width: "50%",
      padding: 10,
      textAlign: "center",
    },
  });

export default EmployeeListScreen;

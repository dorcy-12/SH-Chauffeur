import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { parseString } from "react-native-xml2js";

// Update with your Odoo server details
const BASE_URL = "http://217.160.15.116";
const DB_NAME = "default_sx3p1odoo";
export async function loginUser(username, password) {
  const url = `${BASE_URL}/jsonrpc`;
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "common",
      method: "login",
      args: [DB_NAME, username, password],
    },
    id: Math.floor(Math.random() * 100),
  };

  try {
    const response = await axios.post(url, payload);
    const userId = response.data.result;
    console.log(userId);
    if (userId) {
      await SecureStore.setItemAsync("userId", userId.toString());
      await SecureStore.setItemAsync("password", password);
      return userId;
    }

    return null;
  } catch (error) {
    console.error("Error in loginUser", error);
    throw error;
  }
}
export async function fetchEmployeeProfile(userId) {
  const url = `${BASE_URL}/jsonrpc`;
  const password = await SecureStore.getItemAsync("password");
  console.log("employee profile " + userId + " " + password) ;
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        await SecureStore.getItemAsync("password"),
        "hr.employee",
        "search_read",
        [[["user_id", "=", parseInt(userId, 10)]]],
        { fields: ["name", "image_1920", "work_email"] },  // Adjust field names if necessary
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const employeeData = response.data.result;
    console.log(employeeData);

    if (employeeData && employeeData.length > 0) {
      const { name, image_1920, work_email } = employeeData[0];
      return { name, profilePicture: image_1920, work_email };
    }
    return null;
  } catch (error) {
    console.error("Error in fetchEmployeeProfile", error);
    throw error; 
  }
}  
 
export async function fetchVehicleServices(userId) {
  const url = `${BASE_URL}/jsonrpc`;
  const password = await SecureStore.getItemAsync("password");

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        password,
        'fleet.vehicle.log.services', 
        'search_read',
        [[]],
        { fields: ['service_type_id', 'vehicle_id', 'date', 'purchaser_id', 'state'] }
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
   
    return response.data.result;
  } catch (error) {
    console.error("Error in fetchVehicleServices", error);
    throw error;
  } 
}

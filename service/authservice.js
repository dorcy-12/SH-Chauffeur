import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { parseString } from "react-native-xml2js";

// Update with your Odoo server details
const BASE_URL = "http://217.160.15.116";
const DB_NAME = "default_xnqp1odoo";
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
export async function fetchEmployeeProfile(userId, password) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "hr.employee",
        "search_read",
        [[["user_id", "=", parseInt(userId, 10)]]],
        { fields: ["id", "name", "image_1920", "work_email"] }, // Adjust field names if necessary
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const employeeData = response.data.result;
    console.log(employeeData);

    if (employeeData && employeeData.length > 0) {
      const { id, name, image_1920, work_email } = employeeData[0];
      await SecureStore.setItemAsync("employeeId", id.toString());
      return { id, name, profilePicture: image_1920, work_email };
    }
    return null;
  } catch (error) {
    console.error("Error in fetchEmployeeProfile", error);
    throw error;
  }
}

export async function fetchVehicleServices(userId, serviceState, password) {
  const url = `${BASE_URL}/jsonrpc`;
  console.log(userId);
  const pin = await SecureStore.getItemAsync("password");

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "fleet.vehicle.log.services",
        "search_read",
        [[["state", "=", serviceState]]],
        {
          fields: [
            "service_type_id",
            "vehicle_id",
            "date",
            "purchaser_id",
            "state",
            "description",
            "notes",
          ],
        },
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

export async function changeServiceState(
  userId,
  serviceId,
  newState,
  password
) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "fleet.vehicle.log.services", // Replace with your actual service model name
        "write",
        [[serviceId], { state: newState }], // Assuming 'state' is the field to be updated
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    return response.data.result; // Indicate success
  } catch (error) {
    console.error("Error in changeServiceState", error);
    throw error;
  }
}
export async function createEmployeeCheckIn(employeeId, userId, password) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");

  // Get current time in UTC and format it
  const checkInTime = new Date().toISOString();
  const formattedCheckInTime = checkInTime.replace("T", " ").slice(0, 19);

  console.log(formattedCheckInTime);

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "hr.attendance", // Assuming this is the model for check-ins
        "create",
        [
          {
            employee_id: parseInt(employeeId, 10),
            check_in: formattedCheckInTime, // Include the check-in time
            // Add other relevant fields if needed
          },
        ],
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    console.log("check in data " + response.data.result);
    return response.data.result; // Return the result (e.g., ID of the created check-in record)
  } catch (error) {
    console.error("Error in createEmployeeCheckIn", error);
    throw error;
  }
}

export async function createEmployeeCheckOut(checkInId, userId, password) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");

  // Get current time in UTC and format it
  const checkOutTime = new Date().toISOString();
  const formattedCheckOutTime = checkOutTime.replace("T", " ").slice(0, 19);

  console.log(formattedCheckOutTime);

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "hr.attendance", // Assuming this is the model for check-outs
        "write", // 'write' method is typically used for updating existing records
        [
          parseInt(checkInId, 10), // The ID of the check-in record to update
          {
            check_out: formattedCheckOutTime, // Include the check-out time
          },
        ],
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    console.log("check out data " + response);
    return response.data.result; // This might return a success status or the updated record ID
  } catch (error) {
    console.error("Error in createEmployeeCheckOut", error);
    throw error;
  }
}
export async function fetchCompletedServices(userId, serviceState, password) {
  const url = `${BASE_URL}/jsonrpc`;

  console.log(userId);
  const pin = await SecureStore.getItemAsync("password");

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "fleet.vehicle.log.services",
        "search_read",
        [[["state", "=", serviceState]]],
        {
          fields: [
            "service_type_id",
            "vehicle_id",
            "date",
            "purchaser_id",
            "state",
            "description",
            "notes",
          ],
        },
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
export async function fetchPartnerId(userId, password) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "res.users",
        "read",
        [parseInt(userId, 10)],
        { fields: ["partner_id"] }, // Fields to fetch
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const userData = response.data.result;
    console.log(userData);

    if (userData && userData.length > 0) {
      const { partner_id } = userData[0];
      return partner_id[0]; // Returns the partner_id
    }
    return null;
  } catch (error) {
    console.error("Error in fetchPartnerId", error);
    throw error;
  }
}
export async function uploadFirebaseToken(
  partnerId,
  firebaseToken,
  userId,
  password
) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "mail.firebase",
        "create",
        [
          {
            partner_id: parseInt(partnerId, 10),
            token: firebaseToken,
            os: "Android", // Example: Specify the OS or make it a parameter
          },
        ],
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const result = response.data.result;
    console.log("Firebase token uploaded. Record ID:", result);
    return result; // Returns the ID of the created record
  } catch (error) {
    console.error("Error in uploadFirebaseToken", error);
    throw error;
  }
}
export async function deleteUserFirebaseTokens(userId) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "mail.firebase",
        "unlink",
        [[["user_id", "=", parseInt(userId, 10)]]], // Domain to find tokens by user_id
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    // Directly delete all token records for the user
    const response = await axios.post(url, payload);
    console.log("Firebase tokens deleted successfully for user:", userId);
    return response.data.result; // True if successful
  } catch (error) {
    console.error("Error in deleteUserFirebaseTokens", error);
    throw error;
  }
}
export async function getDiscussChannels(userId, partnerId) {
  const url = `${BASE_URL}/jsonrpc`;
  const pin = await SecureStore.getItemAsync("password");

  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        userId,
        pin,
        "mail.channel",
        "search_read",
        [[['channel_partner_ids', 'in', partnerId ]]], // Your domain, an empty list means all records
        { fields: ["name", "description", "channel_type"] }, // Specify the fields you want to retrieve
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const result = response.data.result;
    console.log("Channels successfully retrieved");
    return result; // Returns the ID of the created record
  } catch (error) {
    console.error("Error in retrieving channels", error);
    throw error;
  }
}

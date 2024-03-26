import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

import { insertChannel } from "../database";

// Update with your Odoo server details
const BASE_URL = "https://sh-odoo.com";
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
        {
          fields: ["id", "name", "image_1920", "work_email", "user_partner_id"],
        }, // Adjust field names if necessary
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const employeeData = response.data.result;
    console.log(employeeData);

    if (employeeData && employeeData.length > 0) {
      await SecureStore.setItemAsync("employeeId", `${employeeData[0].id}`);
      return employeeData[0];
    }
    return null;
  } catch (error) {
    console.error("Error in fetchEmployeeProfile", error);
    throw error;
  }
}
export async function fetchAllEmployees(userId, password, myEmployeeId) {
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
        [[["id", "!=", myEmployeeId]]], // Empty array for matching all records
        {
          fields: [
            "id",
            "name",
            "work_email",
            "mobile_phone",
            "user_partner_id",
            "attendance_state",
          ], // Specify the fields you want to retrieve
          // Include other fields if needed
        },
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const employees = response.data.result;
    console.log("Employees successfully retrieved", employees);
    return employees;
  } catch (error) {
    console.error("Error in fetch all employees", error);
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
        password,
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
export async function deleteUserFirebaseTokens(userId, tokenId) {
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
        [[parseInt(tokenId, 10)]], // Domain to find tokens by user_id
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    // Directly delete all token records for the user
    const response = await axios.post(url, payload);
    console.log("Firebase tokens deleted successfully for user:", userId);
    console.log("response is :", response.data.result);
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
        [[["channel_partner_ids", "in", partnerId]]], // Your domain, an empty list means all records
        { fields: ["id", "name", "description", "channel_type"] }, // Specify the fields you want to retrieve
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const result = response.data.result;
    console.log("Channels successfully retrieved", result);
    return result; // Returns the ID of the created record
  } catch (error) {
    console.error("Error in retrieving channels", error);
    throw error;
  }
}
export async function sendMessage(userId, channel_id, msg, attachment_id) {
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
        "message_post",
        [channel_id],
        {
          body: msg,
          message_type: "comment",
          subtype_xmlid: "mail.mt_comment",
          attachment_ids: attachment_id,
        },
      ],
    },
    id: Math.floor(Math.random() * 100) + 3,
  };

  try {
    const response = await axios.post(url, payload);
    const result = response.data.result;
    console.log("Message successfully sent with " + result);
    return result; // Returns the ID of the created record
  } catch (error) {
    console.error("Error in sending message", error);
    throw error;
  }
}
export async function getServerMessages(userId, channel_id, limit) {
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
        "mail.message",
        "search_read",
        [
          [
            ["res_id", "=", channel_id],
            ["model", "=", "mail.channel"],
          ],
        ],
        {
          fields: ["id", "body", "date", "author_id", "attachment_ids"],
          limit: limit,
        },
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const result = response.data.result;
    console.log("Messages successfully retrieved ");
    return result; // Returns the ID of the created record
  } catch (error) {
    console.error("Error in retrieving messages", error);
    throw error;
  }
}

export async function downloadAttachment(userId, attachmentId) {
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
        userId, // User ID obtained after authentication
        pin,
        "ir.attachment",
        "read",
        [attachmentId],
        { fields: ["name", "datas", "mimetype"] },
      ],
    },
    id: Math.floor(Math.random() * 100) + 2,
  };

  try {
    const response = await axios.post(url, payload);

    const attachmentData = response.data.result && response.data.result[0];
    if (attachmentData && attachmentData.datas) {
      // Decode the base64 data
      const decodedData = Buffer.from(attachmentData.datas, "base64");
      // Handle the decoded data (e.g., save to file, display, etc.)
      return decodedData;
    } else {
      console.log("No data available for the attachment.");
    }
  } catch (error) {
    console.error("Error fetching attachment:", error);
  }
}
export async function uploadAttachment(
  channelId,
  encodedFileContent,
  fileName
) {
  const payload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB_NAME,
        uid,
        password,
        "ir.attachment",
        "create",
        [
          {
            name: fileName, // File name
            datas: encodedFileContent, // Base64 encoded content
            res_model: "mail.channel",
            res_id: channelId,
          },
        ],
      ],
    },
    id: Math.floor(Math.random() * 100) + 4,
  };

  try {
    const response = await axios.post(url, payload);
    const result = response.data.result;
    console.log("Attachment successfully uploaded");
    return result; // Returns the ID of the created record
  } catch (error) {
    console.error("Error in uploading attachment", error);
    throw error;
  }
}

export async function fetchVehicles(userId) {
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
        "fleet.vehicle",
        "search_read",
        [[]], // Empty array for matching all records
        {
          fields: ["id", "name", "description", "license_plate"], // Specify the fields you want to retrieve
        },
      ],
    },
    id: Math.floor(Math.random() * 100) + 1,
  };

  try {
    const response = await axios.post(url, payload);
    const Vehicles = response.data.result;
    console.log("Vehicles successfully retrieved", Vehicles);
    return Vehicles;
  } catch (error) {
    console.error("Error in fetch Vehicles", error);
    throw error;
  }
}

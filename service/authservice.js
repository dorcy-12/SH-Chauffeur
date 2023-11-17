import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { parseString } from "react-native-xml2js";

// Update with your Odoo server details
const BASE_URL = "http://217.160.15.116";
const DB_NAME = "default_sx3p1odoo";

export async function loginUser(username, password) {
  const url = `${BASE_URL}/xmlrpc/2/common`;
  const xml = `<?xml version="1.0"?>
  <methodCall>
      <methodName>login</methodName>
      <params>
          <param>
              <value><string>${DB_NAME}</string></value>
          </param>
          <param>
              <value><string>${username}</string></value>
          </param>
          <param>
              <value><string>${password}</string></value>
          </param>
      </params>
  </methodCall>`;

  try {
    const response = await axios.post(url, xml, {
      headers: {
        "Content-Type": "text/xml",
      },
    });

    const userId = parseXmlResponse(response.data); // Parse this XML response to get the user ID

    // Assuming user ID is stored if the login is successful
    if (userId) {
      // Optionally store the userId in SecureStore
      await SecureStore.setItemAsync("userId", userId.toString());
      return userId;
    }

    return null; // Return null if login failed
  } catch (error) {
    console.error("Error in loginUser", error);
    throw error;
  }
}

export async function logoutUser() {

}



// Function to parse the XML response
const parseXmlResponse = (xmlResponse) => {
  parseString(xmlResponse, (err, result) => {
    if (err) {
      console.error("Error parsing XML:", err);
      return null;
    } else {
      // Extract the relevant data from the parsed response
      const responseValue = result.methodResponse.params[0].param[0].value[0];
      if ("int" in responseValue) {
        return parseInt(responseValue.int[0]);
      } else if (
        "boolean" in responseValue &&
        responseValue.boolean[0] === "0"
      ) {
        return null;
      }
    }
  });
};

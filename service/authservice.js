import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.0.105:8000';

export async function loginUser(employee_id, password) {
    try {
        const response = await axios.post(`${BASE_URL}/api/custom-login/`, {
            employee_id: employee_id,
            password: password
        });
        const token = response.data.token;

        // Store the token in SecureStore
        await SecureStore.setItemAsync("userToken", token); // This should contain the token if successful
    } catch (error) {
        console.error("There was an error logging in", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        console.log('inside logout');

        // Fetch the token
        const token = await getToken();

        // Make a POST request to logout endpoint
        await axios.post(`${BASE_URL}/api/logout/`, {}, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        // Delete the token from SecureStore
        await SecureStore.deleteItemAsync('userToken');
        
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

export async function fetchTrips() {
    const token = await getToken();
    try {
        const response = await axios.get(`${BASE_URL}/api/get_trips/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch trips:", error);
        throw error;
    }
}


export async function getToken() {
    try {
        return await SecureStore.getItemAsync('userToken');
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}


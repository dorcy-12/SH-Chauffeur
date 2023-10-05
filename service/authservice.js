import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.0.105:8000';

export async function loginUser(employee_id, password) {
    try {
        const response = await axios.post(`${BASE_URL}/api/custom-login/`, {
            employee_id: employee_id,
            password: password
        });
        return response.data.token;  // This should contain the token if successful
    } catch (error) {
        console.error("There was an error logging in", error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        console.log('inside logout')
        await SecureStore.deleteItemAsync('userToken');
    } catch (error) {
        console.error("Error during logout:", error);
    }
}

export async function getToken() {
    try {
        return await SecureStore.getItemAsync('userToken');
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}

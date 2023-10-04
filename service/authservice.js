import axios from 'axios';

const BASE_URL = 'http://192.168.178.90:8000';

export async function loginUser(employee_id, password) {
    try {
        const response = await axios.post(`${BASE_URL}/api/custom-login/`, {
            employee_id: employee_id,
            password: password
        });
        return response.data;  // This should contain the token if successful
    } catch (error) {
        console.error("There was an error logging in", error);
        throw error;
    }
}

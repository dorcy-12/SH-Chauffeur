import axios from "axios";

const BaseUrl = "http://192.168.178.90:8000"

const fetchLoginDetails = async (employeeId, pin) => {
  try {
    const response = await axios.post(`${BaseUrl}/api/custom-login/`, {
      employee_id: employeeId,
      password : pin,
    });

    // Handle successful response
    console.log('Login details:', response.data);
    return response.data; // You can return the data or handle it accordingly
  } catch (error) {
    // Handle error
    console.error('Error fetching login details:', error.message);
    throw error; // You can handle the error or rethrow it for further handling
  }
};

export default fetchLoginDetails;

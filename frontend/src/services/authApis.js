import axios from "axios";



const API = axios.create({
  baseURL: "http://localhost:8080", 
});



// register user api
export const registerUser = async (formData) => {
  try {
    const response = await API.post("/register", formData);
    return response.data; //success or fail is returend
  } catch (error) {
    
    throw error.response?.data || "Something went wrong";
  }
};



//login user api

export async function loginUser(data) {
  try {
    const response = await API.post("/login", data); 
    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
}






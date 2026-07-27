
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const loginUser = async ({ email, password }) => {
  try {
    const response = await API.post("/login", { email, password });
    return response.data;  // returns user details here
  } catch (error) {
    
    throw { 
      message: error.response?.data?.message || "Login failed. Please try again."
    };
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await API.post("/register", formData);
    return response.data;
  } catch (error) {
    
    throw { 
      message: error.response?.data?.message || "Registration failed. Please try again."
    };
  }
};
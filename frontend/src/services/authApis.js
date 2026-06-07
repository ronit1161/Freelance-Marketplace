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
  console.log("FULL ERROR:", error);
  console.log("BACKEND ERROR:", error.response);
  console.log("DATA:", error.response?.data);
  throw error.response?.data || "registration failed";
}
};


// test signup api

// export const registerUser = async (formData) => {
//   try {
//     const response = await API.post("/register", formData);

    
//     return {
//       success: true,
//       message: "Fake success response",
//       data: response.data
//     };

//   } catch (error) {
//     return {
//       success: false,
//       message: "Fake failure response"
//     };
//   }
// };







//login user api

// export async function loginUser(data) {
//   try {
//     const response = await API.post("/login", data); 
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || "Login failed";
//   }
// }


//test login api
export async function loginUser(data) {
  // fake delay (optional)
  await new Promise((res) => setTimeout(res, 500));

  // fake login logic
  if (data.email === "test@gmail.com" && data.password === "1234") {
    return {
      role: "freelancer",   // change to "client" to test
      email: data.email,
    };
  } else {
    throw "Invalid credentials";
  }
}






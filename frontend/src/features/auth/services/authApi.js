import { marketplaceStore } from "../../../Services/marketplaceStore";

export const loginUser = async ({ email, password }) => {
  // Pre-configured role accounts
  const storeUsers = marketplaceStore.getUsers();
  const existingUser = storeUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    if (existingUser.status === "BLOCKED") {
      throw { message: "Your account has been suspended by the administrator." };
    }
    return existingUser;
  }

  // Fallback default role assignment based on email substring if new credential
  let role = "client";
  let name = email.split('@')[0];
  name = name.charAt(0).toUpperCase() + name.slice(1);

  if (email.toLowerCase().includes("admin")) {
    role = "admin";
    name = "Admin Portal";
  } else if (email.toLowerCase().includes("freelancer")) {
    role = "freelancer";
    name = "Freelancer Member";
  }

  const newUser = marketplaceStore.addUser({
    name,
    email,
    role
  });

  return newUser;
};

export const registerUser = async (formData) => {
  if (formData.role === "admin" || formData.role === "ADMIN") {
    throw { message: "Admin registration is not allowed. Only Client and Freelancer accounts can register." };
  }

  const existingUsers = marketplaceStore.getUsers();
  if (existingUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
    throw { message: "An account with this email address already exists." };
  }

  const newUser = marketplaceStore.addUser({
    name: formData.name,
    email: formData.email,
    role: formData.role || "client",
    bio: formData.bio || ""
  });

  return newUser;
};
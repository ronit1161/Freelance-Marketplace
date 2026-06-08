const USERS_KEY = "freelance_users";
const SESSION_KEY = "auth_user";

export const registerUser = async (formData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  if (users.some((u) => u.email === formData.email)) {
    throw { message: "Email already exists" };
  }

  const newUser = { id: Date.now(), ...formData };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return { success: true, user: { name: newUser.name, role: newUser.role, email: newUser.email } };
};

export async function loginUser({ email, password }) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw { message: "Invalid email or password" };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({
    email: user.email,
    role: user.role,
    name: user.name,
  }));

  return { role: user.role, name: user.name, email: user.email };
}

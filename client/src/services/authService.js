import axios from "axios";

const API_URL =
  "https://smart-exam-seat-allocation-system.onrender.com/api/auth";

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    }

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Login Failed"
    );
  }
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get Token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get Current User
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

// Check Authentication
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Auth Header
export const authHeader = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
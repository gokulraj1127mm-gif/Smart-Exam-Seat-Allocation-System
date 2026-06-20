import axios from "axios";
import { authHeader } from "./authService";


const API_URL =
  "https://smart-exam-seat-allocation-system.onrender.com/api/students";

// Get All Students
export const getAllStudents = async () => {
  try {
    const response = await axios.get(
      API_URL,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch students"
    );
  }
};

// Get Student By ID
export const getStudentById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/${id}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch student"
    );
  }
};

// Add Student
export const addStudent = async (studentData) => {
  try {
    const response = await axios.post(
      API_URL,
      studentData,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to add student"
    );
  }
};

// Update Student
export const updateStudent = async (
  id,
  studentData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      studentData,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to update student"
    );
  }
};

// Delete Student
export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to delete student"
    );
  }
};

// Search Students
export const searchStudents = async (keyword) => {
  try {
    const response = await axios.get(
      `${API_URL}/search/${keyword}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to search students"
    );
  }
};
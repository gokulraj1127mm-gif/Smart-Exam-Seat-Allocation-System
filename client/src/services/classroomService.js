import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:5000/api/classrooms";

// Get All Classrooms
export const getAllClassrooms = async () => {
  try {
    const response = await axios.get(
      API_URL,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch classrooms"
    );
  }
};

// Get Classroom By ID
export const getClassroomById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/${id}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch classroom"
    );
  }
};

// Add Classroom
export const addClassroom = async (classroomData) => {
  try {
    const response = await axios.post(
      API_URL,
      classroomData,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to add classroom"
    );
  }
};

// Update Classroom
export const updateClassroom = async (
  id,
  classroomData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      classroomData,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to update classroom"
    );
  }
};

// Delete Classroom
export const deleteClassroom = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to delete classroom"
    );
  }
};
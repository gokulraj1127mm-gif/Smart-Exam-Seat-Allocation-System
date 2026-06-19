import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:5000/api/exams";

// Get All Exams
export const getAllExams = async () => {
  try {
    const response = await axios.get(
      API_URL,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch exams"
    );
  }
};

// Get Exam By ID
export const getExamById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/${id}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch exam"
    );
  }
};

// Create Exam
export const createExam = async (examData) => {
  try {
    const response = await axios.post(
      API_URL,
      examData,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to create exam"
    );
  }
};

// Update Exam
export const updateExam = async (
  id,
  examData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      examData,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to update exam"
    );
  }
};

// Delete Exam
export const deleteExam = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to delete exam"
    );
  }
};
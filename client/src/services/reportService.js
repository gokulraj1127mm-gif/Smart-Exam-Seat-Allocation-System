import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:5000/api/reports";

// Get Hall Wise Report
export const getHallWiseReport = async (examId) => {
  try {
    const response = await axios.get(
      `${API_URL}/hall/${examId}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch hall report"
    );
  }
};

// Get Student Wise Report
export const getStudentReport = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/student/${studentId}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch student report"
    );
  }
};

// Get Attendance Sheet
export const getAttendanceSheet = async (examId) => {
  try {
    const response = await axios.get(
      `${API_URL}/attendance/${examId}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch attendance sheet"
    );
  }
};

// Get Exam Allocation Report
export const getAllocationReport = async (examId) => {
  try {
    const response = await axios.get(
      `${API_URL}/allocation/${examId}`,
      authHeader()
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to fetch allocation report"
    );
  }
};

// Download PDF Report
export const downloadPdfReport = async (
  reportType,
  id
) => {
  try {
    const response = await axios.get(
      `${API_URL}/pdf/${reportType}/${id}`,
      {
        ...authHeader(),
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;

    link.setAttribute(
      "download",
      `${reportType}-report.pdf`
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Failed to download PDF"
    );
  }
};
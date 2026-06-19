const express = require("express");

const {
  getDashboardStats,
  getStudentReport,
  getClassroomReport,
  getExamReport,
  getSummaryReport,
  downloadOverallSeatingReport // 1. Imported the missing layout report engine
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard Statistics Endpoint
router.get(
  "/dashboard",
  protect,
  getDashboardStats
);

// Student Listing Master JSON Report Endpoint
router.get(
  "/students",
  protect,
  getStudentReport
);

// Classroom Grid JSON Report Endpoint
router.get(
  "/classrooms",
  protect,
  getClassroomReport
);

// Exam Timetable Master JSON Report Endpoint
router.get(
  "/exams",
  protect,
  getExamReport
);

// System Counter Metrics Summary Endpoint
router.get(
  "/summary",
  protect,
  getSummaryReport
);

/**
 * 2. New PDF stream generation link path
 * Accessible directly by admin components and student portal cards
 * Publicly streaming so browser native tabs can initialize window download protocols seamlessly
 */
router.get(
  "/overall-seating",
  downloadOverallSeatingReport
);

module.exports = router;
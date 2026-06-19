const Exam = require("../models/Exam");
const SeatAllocation = require("../models/SeatAllocation"); // CRITICAL IMPORT FIX

/**
 * Get All Exams
 * GET /api/exams
 */
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({
      date: 1,
    });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
    });
  }
};

/**
 * Get Exam By ID
 * GET /api/exams/:id
 */
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
    });
  }
};

/**
 * Create Exam
 * POST /api/exams
 */
const createExam = async (req, res) => {
  try {
    const {
      examName,
      subjectCode,
      subjectName,
      department,
      year,
      semester,
      date,
      session,
    } = req.body;

    const exam = await Exam.create({
      examName,
      subjectCode,
      subjectName,
      department,
      year,
      semester,
      date,
      session,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Exam
 * PUT /api/exams/:id
 */
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update exam",
    });
  }
};

/**
 * Delete Exam
 * DELETE /api/exams/:id
 */
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Drop the primary exam profile document
    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // 2. CRITICAL HOOK FIX: Wipe all seat allocation matrices built off this deleted exam schema
    await SeatAllocation.deleteMany({ examId: id });

    res.status(200).json({
      success: true,
      message: "Exam blueprint and all corresponding seating map indices wiped clean.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete exam",
    });
  }
};

module.exports = {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
};
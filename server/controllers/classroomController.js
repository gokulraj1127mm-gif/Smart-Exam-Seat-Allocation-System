const Classroom = require("../models/Classroom");
const SeatAllocation = require("../models/SeatAllocation"); // CRITICAL IMPORT FIX

// Get All Classrooms
const getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();

    res.status(200).json({
      success: true,
      data: classrooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Classroom By ID
const getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classroom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Classroom
const createClassroom = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const classroom = await Classroom.create(req.body);

    res.status(201).json({
      success: true,
      data: classroom,
    });
  } catch (error) {
    console.error("CREATE CLASSROOM ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Classroom
const updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classroom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Classroom
const deleteClassroom = async (req, res) => {
  try {
    // 1. Fetch the target classroom blueprint to capture its exact hall number string
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    const hallNoToDelete = String(classroom.hallNo).trim();

    // 2. Safely drop the classroom object document out of the database
    await Classroom.findByIdAndDelete(req.params.id);

    // 3. CRITICAL HOOK FIX: Automatically clear out all active or historic seating records 
    // that belonged to this specific hall name across any exams/dates.
    await SeatAllocation.deleteMany({ hallNo: hallNoToDelete });

    res.status(200).json({
      success: true,
      message: "Classroom and all corresponding seating matrix layout rows deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
};
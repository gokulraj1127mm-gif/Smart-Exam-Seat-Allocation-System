const express = require("express");

const {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",  getAllExams);

router.get("/:id",  getExamById);

router.post("/",  createExam);

router.put("/:id",  updateExam);

router.delete("/:id", deleteExam);

module.exports = router;
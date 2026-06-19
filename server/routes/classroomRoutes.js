const express = require("express");

const {
  getAllClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} = require("../controllers/classroomController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",  getAllClassrooms);
router.get("/:id", getClassroomById);
router.post("/",  createClassroom);
router.put("/:id", updateClassroom);
router.delete("/:id", deleteClassroom);

module.exports = router;
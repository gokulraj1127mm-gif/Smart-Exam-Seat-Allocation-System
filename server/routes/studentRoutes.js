const express = require("express");

const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudents,
  studentLogin,

} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.get("/", getAllStudents);
router.post("/login", studentLogin);
router.get("/:id", getStudentById);

router.post("/", createStudent);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);

router.post(
  "/import",
  upload.single("file"),
  importStudents
);

module.exports = router;
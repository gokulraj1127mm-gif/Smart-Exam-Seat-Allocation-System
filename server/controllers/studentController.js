const XLSX = require("xlsx");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Ensure jsonwebtoken package is installed

/**
 * Helper Utility: Safely parses mixed string formats, Roman numerals, 
 * or descriptive text (e.g., "I", "3rd Year", " 2 ") into a clean base-10 Integer.
 */
const parseYearToNumber = (rawYear) => {
  if (rawYear === undefined || rawYear === null || rawYear === "") return undefined;
  
  // Normalize string for consistent matching
  const yearStr = String(rawYear).toUpperCase().trim();

  // 1. Handle common Roman Numerals
  const romanMap = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5 };
  if (romanMap[yearStr]) return romanMap[yearStr];

  // 2. Extract digits if they write descriptive text like "3rd Year" or "2nd"
  const digitMatch = yearStr.match(/\d+/);
  if (digitMatch) return parseInt(digitMatch[0], 10);

  // 3. Fallback direct conversion
  const parsed = parseInt(yearStr, 10);
  return isNaN(parsed) ? undefined : parsed;
};

/**
 * Get All Students
 * GET /api/students
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

/**
 * Get Student By ID
 * GET /api/students/:id
 */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

/**
 * Create Student
 * POST /api/students
 */
const createStudent = async (req, res) => {
  try {
    const {
      regNo,
      name,
      email,
      department,
      year,
      section,
    } = req.body;

    // Standardize registration number to plain string
    const cleanRegNo = String(regNo).trim();

    const existingStudent = await Student.findOne({ regNo: cleanRegNo });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    // Securely hash the registration number as the default password string
    const hashedPassword = await bcrypt.hash(cleanRegNo, 10);

    // Sanitize and force Year payload into a true Number primitive
    const standardizedYear = parseYearToNumber(year);

    const student = await Student.create({
      regNo: cleanRegNo,
      name,
      email,
      password: hashedPassword,
      department,
      year: standardizedYear,
      section,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create student",
    });
  }
};

/**
 * Update Student
 * PUT /api/students/:id
 */
const updateStudent = async (req, res) => {
  try {
    // If the year field is modified during updates, parse it cleanly here as well
    if (req.body.year !== undefined) {
      req.body.year = parseYearToNumber(req.body.year);
    }

    // FIXED: Changed old deprecated `{ new: true }` property to standard `{ returnDocument: "after" }`
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

/**
 * Delete Student
 * DELETE /api/students/:id
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};

/**
 * Import Students via Excel Sheet
 * POST /api/students/import
 */
const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log("Excel Data Parsed From File:", data);

    const processedStudents = await Promise.all(
      data.map(async (row) => {
        const rawRegNo = row.regNo || row.RegNo;
        // Turn into explicit text strings to safeguard bcrypt hashing functions from breaking
        const structuralRegNo = rawRegNo ? String(rawRegNo).trim() : "";
        
        // Handle Roman Numerals ("I", "II") or text combinations from Excel cell structures cleanly
        const rawYearField = row.year || row.Year;
        const standardizedYear = parseYearToNumber(rawYearField);

        return {
          regNo: structuralRegNo,
          name: row.name || row.Name,
          department: row.department || row.Department,
          year: standardizedYear, 
          section: row.section || row.Section,
          email: row.email || row.Email,
          password: await bcrypt.hash(structuralRegNo || "123456", 10),
        };
      })
    );

    // Verify all core model specifications evaluate successfully before persisting documents
    const validStudents = processedStudents.filter(
      (student) =>
        student.regNo &&
        student.name &&
        student.department &&
        student.year !== undefined && 
        student.section
    );

    if (validStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid student records with parsing-friendly years found in Excel sheet",
      });
    }

    await Student.insertMany(validStudents);

    res.status(200).json({
      success: true,
      message: `${validStudents.length} students imported successfully`,
    });
  } catch (error) {
    console.error("Bulk Import Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Import failed",
    });
  }
};

/**
 * Student Login
 * POST /api/students/login
 */
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 2. Compare incoming plain text password with database bcrypt hash
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. FIXED: Generate a clean signed JSON Web Token string signature payload
    // Uses process.env.JWT_SECRET if present; falls back safely to 'secret' for testing configurations
    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    // 4. Return token string and sanitized data payload back to client workspace
    res.status(200).json({
      success: true,
      token, // Return token so the client headers can match authorized context maps safely
      student: {
        _id: student._id,
        regNo: student.regNo,
        name: student.name,
        department: student.department,
        year: student.year,
        section: student.section,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Student Login Error Handling Routing Log:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudents,
  studentLogin,
};
const Student = require("../models/Student");
const Classroom = require("../models/Classroom");
const Exam = require("../models/Exam");
const SeatAllocation = require("../models/SeatAllocation");
const PDFDocument = require("pdfkit");

/**
 * Dashboard Statistics
 * GET /api/reports/dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalClassrooms = await Classroom.countDocuments();
    const totalExams = await Exam.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalClassrooms,
        totalExams,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

/**
 * Student Report
 * GET /api/reports/students
 */
const getStudentReport = async (req, res) => {
  try {
    const students = await Student.find().sort({ department: 1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate student report",
    });
  }
};

/**
 * Classroom Report
 * GET /api/reports/classrooms
 */
const getClassroomReport = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json({
      success: true,
      count: classrooms.length,
      data: classrooms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate classroom report",
    });
  }
};

/**
 * Exam Report
 * GET /api/reports/exams
 */
const getExamReport = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate exam report",
    });
  }
};

/**
 * Overall System Summary Report
 * GET /api/reports/summary
 */
const getSummaryReport = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalClassrooms = await Classroom.countDocuments();
    const totalExams = await Exam.countDocuments();

    const totalCapacity = await Classroom.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$capacity" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      report: {
        totalStudents,
        totalClassrooms,
        totalExams,
        totalSeatingCapacity: totalCapacity[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate summary report",
    });
  }
};

/**
 * Generate PDF Report for Overall Seating Arrangement Notice
 * GET /api/reports/overall-seating
 */
const downloadOverallSeatingReport = async (req, res) => {
  try {
    const { date, session } = req.query;
    const filterCriteria = {};

    // Build filter schema if constraints are passed from UI
    if (date) {
      // Normalize to date format matching database architecture values
      filterCriteria.examDate = new Date(date);
    }
    if (session) {
      filterCriteria.session = session;
    }

    // 1. Fetch filtered configurations to isolate historical allocations
    const allocations = await SeatAllocation.find(filterCriteria).sort({ 
      hallNo: 1, 
      department: 1,
      regNo: 1 
    });

    if (!allocations.length) {
      return res.status(404).json({
        success: false,
        message: "No active seating configurations found matching parameters.",
      });
    }

    // Extract dynamic metadata based on the current records found
    const baseRecord = allocations[0];
    const formattedExamDate = baseRecord.examDate
      ? new Date(baseRecord.examDate).toLocaleDateString("en-GB")
      : "18/06/2026";
    const examSession = baseRecord.session || "FN";

    // 2. Aggregate flat seat lists into consolidated blocks
    const groupedRows = [];
    let currentGroup = null;

    allocations.forEach((record) => {
      const currentSubjectCode = record.subjectCode || record.examCode || "N/A";
      const key = `${record.hallNo}_${record.department}_${currentSubjectCode}`;
      const numericReg = parseInt(String(record.regNo || record.registerNo).trim(), 10);

      if (!currentGroup || currentGroup.key !== key) {
        if (currentGroup) {
          groupedRows.push(currentGroup);
        }
        currentGroup = {
          key,
          hallNo: record.hallNo,
          department: record.department,
          subjectCode: currentSubjectCode,
          registerNumbers: isNaN(numericReg) ? [] : [numericReg],
          rawStrings: isNaN(numericReg) ? [String(record.regNo || record.registerNo)] : [],
          count: 1,
        };
      } else {
        if (!isNaN(numericReg)) {
          currentGroup.registerNumbers.push(numericReg);
        } else {
          currentGroup.rawStrings.push(String(record.regNo || record.registerNo));
        }
        currentGroup.count += 1;
      }
    });
    if (currentGroup) groupedRows.push(currentGroup);

    // 3. Document Streaming Setup Initialization
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Overall_Seating_${formattedExamDate.replace(/\//g, "-")}.pdf`
    );
    doc.pipe(res);

    // Reusable header structure engine
    const drawPageHeader = () => {
      doc.fontSize(10).font("Helvetica-Bold").text("OFFICE OF THE CONTROLLER OF EXAMINATIONS", { align: "center" });
      doc.fontSize(12).text("ST. PETER'S COLLEGE OF ENGINEERING AND TECHNOLOGY", { align: "center" });
      doc.fontSize(8).font("Helvetica").text("(An Autonomous Institution)", { align: "center" });
      doc.text("Affiliated to Anna University | Approved by AICTE", { align: "center" });
      doc.text("Avadi, Chennai - 600 054", { align: "center" });
      doc.moveDown(0.4);
      doc.fontSize(10).font("Helvetica-Bold").text("END SEMESTER EXAMINATIONS - APR/MAY-2026", { align: "center" });
      doc.text("OVERALL SEATING ARRANGEMENTS", { align: "center" });
      doc.moveDown(0.8);

      doc.fontSize(9).font("Helvetica").text(`Exam Date :  ${formattedExamDate}`, 40, doc.y, { continued: true });
      doc.text(`Exam Session :  ${examSession === "FN" ? "FN" : "AN"}`, { align: "right" });
      doc.moveDown(0.4);
    };

    // Reusable function to print table headers cleanly aligned
    const drawTableHeader = (trackY) => {
      doc.lineCap("butt").moveTo(40, trackY).lineTo(555, trackY).stroke();
      doc.font("Helvetica-Bold").fontSize(8.5);
      
      doc.text("S. No.", 40, trackY + 8, { width: 30, align: "center" });
      doc.text("Hall No.", 70, trackY + 8, { width: 45, align: "center" });
      doc.text("Degree & Branch", 115, trackY + 8, { width: 85, align: "left" });
      doc.text("Course Code", 200, trackY + 8, { width: 55, align: "center" });
      doc.text("Register Nos.", 260, trackY + 8, { width: 210, align: "left" });
      doc.text("No. of Candidates", 475, trackY + 4, { width: 80, align: "center" });

      const postHeaderY = trackY + 26;
      doc.moveTo(40, postHeaderY).lineTo(555, postHeaderY).stroke();
      return postHeaderY;
    };

    // Initial Render of Headers
    drawPageHeader();
    let currentY = drawTableHeader(doc.y);

    // --- Dynamic Row Mapping Generation Engine ---
    doc.font("Helvetica").fontSize(8.5);
    let cumulativeGrandTotal = 0;

    groupedRows.forEach((row, index) => {
      cumulativeGrandTotal += row.count;

      let registerDisplayToken = "";
      if (row.registerNumbers.length > 0) {
        row.registerNumbers.sort((a, b) => a - b);
        if (row.registerNumbers.length > 1) {
          registerDisplayToken = `${row.registerNumbers[0]} to ${
            row.registerNumbers[row.registerNumbers.length - 1]
          }`;
        } else {
          registerDisplayToken = `${row.registerNumbers[0]}`;
        }
      } else if (row.rawStrings.length > 0) {
        registerDisplayToken = row.rawStrings.join(", ");
      }

      // Automatically page break if limits exceeded
      if (currentY > 720) {
        doc.addPage();
        drawPageHeader();
        currentY = drawTableHeader(doc.y);
        doc.font("Helvetica").fontSize(8.5); 
      }

      // Populate row text items
      doc.text(String(index + 1), 40, currentY + 6, { width: 30, align: "center" });
      doc.text(String(row.hallNo), 70, currentY + 6, { width: 45, align: "center" });
      doc.text(String(row.department), 115, currentY + 6, { width: 85, align: "left" });
      doc.text(String(row.subjectCode), 200, currentY + 6, { width: 55, align: "center" });
      doc.text(registerDisplayToken, 260, currentY + 6, { width: 210, align: "left" });
      doc.text(String(row.count), 475, currentY + 6, { width: 80, align: "center" });

      currentY += 20;
      doc.moveTo(40, currentY).lineTo(555, currentY).stroke();
    });

    if (currentY > 720) {
      doc.addPage();
      drawPageHeader();
      currentY = drawTableHeader(doc.y);
    }

    // --- Draw Final Summary Section Footers ---
    doc.font("Helvetica-Bold");
    doc.text("Total", 260, currentY + 6);
    doc.text(String(cumulativeGrandTotal), 475, currentY + 6, { width: 80, align: "center" });
    doc.moveTo(40, currentY + 20).lineTo(555, currentY + 20).stroke();

    doc.moveDown(2.5);
    doc.text("Chief Superintendent", 435, doc.y, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("PDF Production Matrix Critical Exception Log:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while compiling institutional seating chart report.",
    });
  }
};

module.exports = {
  getDashboardStats,
  getStudentReport,
  getClassroomReport,
  getExamReport,
  getSummaryReport,
  downloadOverallSeatingReport,
};
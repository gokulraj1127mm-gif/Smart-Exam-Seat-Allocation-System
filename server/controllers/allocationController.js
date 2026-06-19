const Student = require("../models/Student");
const Classroom = require("../models/Classroom");
const Exam = require("../models/Exam");
const SeatAllocation = require("../models/SeatAllocation");

/**
 * Clean / Erase seat allocations for a specified hall number
 * POST /api/allocation/clear
 */
const clearAllocation = async (req, res) => {
  try {
    const { hallNo } = req.body;
    if (!hallNo) {
      return res.status(400).json({
        success: false,
        message: "Target 'hallNo' parameters are missing.",
      });
    }

    await SeatAllocation.deleteMany({ hallNo: String(hallNo).trim() });

    res.status(200).json({
      success: true,
      message: `Successfully cleared all seat allocations for Hall ${hallNo}. Layout matrix is now blank.`,
    });
  } catch (error) {
    console.error("Clear Matrix Allocation Engine Error:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while clearing allocations.",
      error: error.message,
    });
  }
};

/**
 * Generate Alternating Seat Allocations for Multiple Exams/Departments
 * ONLY runs when manually triggered by hitting the Action button.
 * POST /api/allocation/generate
 */
const generateAllocation = async (req, res) => {
  try {
    let { examIds, examId, hallNo } = req.body;
    
    if (!examIds && examId) {
      examIds = [examId];
    }

    if (!examIds || !Array.isArray(examIds) || examIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Required parameter 'examIds' must be a non-empty array.",
      });
    }

    if (!hallNo) {
      return res.status(400).json({
        success: false,
        message: "Target 'hallNo' is required to process allocation.",
      });
    }

    // 1. Fetch all requested Exam profiles
    const exams = await Exam.find({ _id: { $in: examIds } });
    if (!exams.length) {
      return res.status(404).json({
        success: false,
        message: "No matching exam profiles found for the provided IDs.",
      });
    }

    const safeExamDate = exams[0].examDate || exams[0].date || new Date();
    const safeSession = exams[0].session || "FN";

    // 2. Fetch target students isolated strictly by department, year, and section requirements
    const examPools = [];
    for (const exam of exams) {
      const studentQuery = {};
      
      if (exam.year) {
        const yearMatch = String(exam.year).match(/\d+/);
        if (yearMatch) {
          studentQuery.year = Number(yearMatch[0]);
        } else if (!isNaN(Number(exam.year))) {
          studentQuery.year = Number(exam.year);
        }
      }

      const orConditions = [];
      const rawDept = exam.departments || exam.department;

      if (Array.isArray(rawDept)) {
        rawDept.forEach((deptObj) => {
          const deptName = typeof deptObj === "object" ? deptObj.name : deptObj;
          const deptSec = typeof deptObj === "object" ? deptObj.section : (exam.section || "A");

          if (deptName) {
            const cleanSecLetter = String(deptSec).replace(/sec\s+/i, "").trim();
            orConditions.push({
              department: deptName,
              section: { $regex: new RegExp(`^(${cleanSecLetter}|Sec\\s+${cleanSecLetter})$`, 'i') }
            });
          }
        });
      } else if (typeof rawDept === "string") {
        const targetDepartments = rawDept.includes(",") 
          ? rawDept.split(",").map(d => d.trim())
          : rawDept.match(/IT|EEE/gi) || [rawDept];

        targetDepartments.forEach((dept, index) => {
          if (dept) {
            const fallbackSec = exam.section || (index === 0 ? "A" : "B");
            const cleanSecLetter = String(fallbackSec).replace(/sec\s+/i, "").trim();
            orConditions.push({
              department: dept.trim(),
              section: { $regex: new RegExp(`^(${cleanSecLetter}|Sec\\s+${cleanSecLetter})$`, 'i') }
            });
          }
        });
      }

      if (orConditions.length > 0) {
        studentQuery.$or = orConditions;
      }

      let students = await Student.find(studentQuery).sort({ regNo: 1 });
      
      if (students.length === 0 && orConditions.length > 0) {
        const structuralFallbackQuery = { $or: orConditions };
        students = await Student.find(structuralFallbackQuery).sort({ regNo: 1 });
      }

      if (students.length > 0) {
        examPools.push({
          exam,
          students,
          pointer: 0 
        });
      }
    }

    if (examPools.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active students found matching specific exam departments, years, or sections.",
      });
    }

    // 3. Target ONLY the specifically requested classroom hall
    const targetHall = await Classroom.findOne({ hallNo: String(hallNo).trim() });
    if (!targetHall) {
      return res.status(404).json({
        success: false,
        message: `Classroom/hall ${hallNo} not found in system settings.`,
      });
    }

    const allocationResult = [];
    const bulkInsertPayload = [];

    const rows = targetHall.rows || 4; 
    const cols = targetHall.columns || 4;
    const capacity = rows * cols;
    const seatsInThisHall = [];

    const poolsWithStudentsLeft = () => examPools.some(p => p.pointer < p.students.length);

    if (poolsWithStudentsLeft()) {
      await SeatAllocation.deleteMany({
        hallNo: String(targetHall.hallNo).trim(),
        examDate: new Date(safeExamDate)
      });

      // 4. Seating Distribution Engine Matrix Loop
      for (let c = 1; c <= cols; c++) {
        const designatedPoolIndex = (c - 1) % examPools.length;
        
        for (let r = 1; r <= rows; r++) {
          if (!poolsWithStudentsLeft()) break;

          let targetPool = examPools[designatedPoolIndex];

          if (!targetPool || targetPool.pointer >= targetPool.students.length) {
            targetPool = examPools.find(p => p.pointer < p.students.length);
          }

          if (!targetPool) break;

          const student = targetPool.students[targetPool.pointer];
          const currentExam = targetPool.exam;

          const currentRowLetter = String.fromCharCode(64 + r); 
          const structuralSeatCode = `${currentRowLetter}${c}`; 

          const safeSubjectCode = currentExam.subjectCode || currentExam.examCode || currentExam.code || "N/A";
          const safeSubjectName = currentExam.subjectName || currentExam.examName || currentExam.name || "Examination";

          const seatObject = {
            seatNo: structuralSeatCode,
            regNo: student.regNo,
            name: student.name,
            student: student.name, 
            department: student.department,
            examName: safeSubjectName
          };

          seatsInThisHall.push(seatObject);

          bulkInsertPayload.push({
            studentId: student._id,
            examId: currentExam._id,
            regNo: student.regNo,
            registerNo: student.regNo, 
            studentName: student.name,
            name: student.name,
            student: student.name, 
            department: student.department,
            year: student.year || 1,
            hallNo: String(targetHall.hallNo),
            seatNo: structuralSeatCode,
            subjectCode: safeSubjectCode,
            examCode: safeSubjectCode,
            subjectName: safeSubjectName,
            examName: safeSubjectName,
            examDate: safeExamDate,
            date: safeExamDate,
            session: safeSession
          });

          targetPool.pointer++; 
        }
      }

      seatsInThisHall.sort((a, b) => a.seatNo.localeCompare(b.seatNo, undefined, { numeric: true }));

      allocationResult.push({
        hallId: targetHall._id,
        hallNo: targetHall.hallNo,
        capacity,
        allocatedSeats: seatsInThisHall,
      });
    }

    if (bulkInsertPayload.length > 0) {
      try {
        await SeatAllocation.insertMany(bulkInsertPayload);
      } catch (dbError) {
        console.error("❌ MONGOOSE VALIDATION CRASH:", dbError.message);
        return res.status(400).json({
          success: false,
          message: "Database unique constraints blocked writing layout matrices.",
          error: dbError.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully calculated and persisted layouts for ${bulkInsertPayload.length} students.`,
      totalAllocated: bulkInsertPayload.length,
      data: bulkInsertPayload,
      allocations: allocationResult, 
    });

  } catch (error) {
    console.error("Allocation Core Matrix Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while calculating allocations.",
      error: error.message
    });
  }
};

const getAllocationsByHall = async (req, res) => {
  try {
    const { hallNo } = req.params;
    const cleanHall = String(hallNo).trim();
    
    const rawAllocations = await SeatAllocation.find({ hallNo: cleanHall }).sort({ seatNo: 1 });
    
    const allocations = rawAllocations.map(item => ({
      seatNo: item.seatNo,
      regNo: item.regNo || item.registerNo,
      student: item.studentName || item.name || item.student, 
      department: item.department,
      examId: item.examId
    }));
    
    res.status(200).json({
      success: true,
      data: allocations
    });
  } catch (error) {
    console.error("Fetch allocations by hall error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve seating data logs for the examination hall."
    });
  }
};

const getAllocations = async (req, res) => {
  try {
    const allocations = await SeatAllocation.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: allocations.length,
      data: allocations,
    });
  } catch (error) {
    console.error("Fetch all allocations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch allocation tracking history data logs.",
    });
  }
};

const getStudentAllocation = async (req, res) => {
  try {
    const { regNo } = req.params;
    const allocation = await SeatAllocation.findOne({ regNo: String(regNo).trim() });

    if (!allocation) {
      return res.status(200).json({
        success: true,
        message: "No current exam schedules or seating profiles mapped to this user profile yet.",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (error) {
    console.error("Fetch student allocation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch targeted student session details.",
    });
  }
};

module.exports = {
  generateAllocation,
  clearAllocation, // Expose clear engine
  getAllocations,
  getAllocationsByHall,
  getStudentAllocation,
};
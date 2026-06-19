const express = require("express");
const router = express.Router();

// Import all controller handlers explicitly 
const {
  generateAllocation,
  getAllocations,
  getAllocationsByHall,
  getStudentAllocation,
} = require("../controllers/allocationController");

// Import authorization middleware guards if available in your project structure
// If you encounter any middleware-related issues, you can temporarily comment this out.
const { protect } = require("../middleware/authMiddleware");

/**
 * Endpoint Base Mounting URI Prefix: "/api/allocation"
 * Handles analytical computations, student tracking layout matrices, and database syncs.
 */

// 1. Generate & persist student seating layout matrices 
// Route Map: POST http://localhost:5000/api/allocation/generate
router.post("/generate", generateAllocation);

// 2. Query structural layout charts for a specific classroom hall number
// Route Map: GET http://localhost:5000/api/allocation/hall/:hallNo
router.get("/hall/:hallNo", getAllocationsByHall);

// 3. Query active seating allocations for an individual student registration number
// Route Map: GET http://localhost:5000/api/allocation/student/:regNo
router.get("/student/:regNo", getStudentAllocation);

// 4. Retrieve historical transaction data logs across all classrooms
// Route Map: GET http://localhost:5000/api/allocation
router.get("/", getAllocations);

module.exports = router;
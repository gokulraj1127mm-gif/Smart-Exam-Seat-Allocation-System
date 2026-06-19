const express = require("express");
const cors = require("cors");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// Global Middlewares Configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Instance Base Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Classroom Seat Allocation API Running Successfully",
  });
});

// Diagnostic Fallback Test Endpoint (Helps verify path availability)
app.get("/api/allocation/test-route", (req, res) => {
  res.json({ success: true, message: "Base structural allocation path routing is reachable!" });
});

// Primary Application Routing Engine Mounts
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/classrooms", require("./routes/classroomRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));

// Binds base prefix directly to your child routing module
app.use("/api/allocation", require("./routes/allocationRoutes"));

app.use("/api/reports", require("./routes/reportRoutes"));

// Catch-All Global Operational Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
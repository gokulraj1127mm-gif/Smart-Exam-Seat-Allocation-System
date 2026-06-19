require("dotenv").config();

console.log(
  "MONGO_URI =",
  process.env.MONGO_URI
);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Smart Classroom Seat Allocation API Running Successfully 🚀",
  });
});

// API Routes
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/students",
  require("./routes/studentRoutes")
);

app.use(
  "/api/classrooms",
  require("./routes/classroomRoutes")
);

app.use(
  "/api/exams",
  require("./routes/examRoutes")
);

app.use(
  "/api/allocation",
  require("./routes/allocationRoutes")
);

app.use(
  "/api/reports",
  require("./routes/reportRoutes")
);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});
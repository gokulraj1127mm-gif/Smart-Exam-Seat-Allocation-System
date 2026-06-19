import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classrooms from "./pages/Classrooms";
import Exams from "./pages/Exams";
import SeatAllocation from "./pages/SeatAllocation";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import MySeat from "./pages/MySeat";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Admin/General Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Student Login */}
        <Route
          path="/student-login"
          element={<StudentLogin />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classrooms"
          element={
            <ProtectedRoute>
              <Classrooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seat-allocation"
          element={
            <ProtectedRoute>
              <SeatAllocation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-seat"
          element={
            <ProtectedRoute>
              <MySeat />
            </ProtectedRoute>
          }
        />

        {/* 404 - Wildcard Route (Keep this at the bottom of Routes) */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold text-red-600">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
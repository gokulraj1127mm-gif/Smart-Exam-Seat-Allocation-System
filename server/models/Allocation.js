const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    seatNo: {
      type: String,
      required: true,
      trim: true,
    },

    hallNo: {
      type: String,
      required: true,
      trim: true,
    },

    examDate: {
      type: Date,
      required: true,
    },

    session: {
      type: String,
      enum: ["FN", "AN"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Allocation",
  allocationSchema
);
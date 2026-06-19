const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    regNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      default: "Male",
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save validation hook (Synchronous style, no 'next' parameter needed)
studentSchema.pre("validate", function () {
  if (this.year !== undefined && this.year !== null) {
    const yearStr = String(this.year).toUpperCase().trim();

    // Map common roman numerals to numbers
    const romanMap = {
      "I": 1,
      "II": 2,
      "III": 3,
      "IV": 4,
      "V": 5
    };

    if (romanMap[yearStr]) {
      this.year = romanMap[yearStr];
    } else {
      const parsedYear = parseInt(yearStr, 10);
      this.year = isNaN(parsedYear) ? undefined : parsedYear;
    }
  }
});

module.exports = mongoose.model("Student", studentSchema);
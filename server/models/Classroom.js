const mongoose = require("mongoose");


const classroomSchema = new mongoose.Schema(
  {
    hallNo: {
      type: String,
      required: [true, "Hall number is required"],
      unique: true,
      trim: true,
    },

   hallName: {
  type: String,
  default: "",
},
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
    },

    rows: {
      type: Number,
      required: [true, "Number of rows is required"],
      min: 1,
    },

    columns: {
      type: Number,
      required: [true, "Number of columns is required"],
      min: 1,
    },

    building: {
      type: String,
      default: "",
      trim: true,
    },

    floor: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Classroom",
  classroomSchema
);
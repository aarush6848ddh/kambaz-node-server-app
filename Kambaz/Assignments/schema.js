import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    points: Number,
    course: { type: String, ref: "CourseModel" },
    dueDate: Date,
    availableFrom: Date,
    availableUntil: Date,
  },
  { collection: "assignments" }
);

export default assignmentSchema;


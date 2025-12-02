import mongoose from "mongoose"; // Load the mongoose Library

// Create a schema to describe the structure of the users collection
const userSchema = new mongoose.Schema(
  {
    _id: String, // primary key
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: String,
    lastName: String,
    dob: Date,
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
      default: "USER",
    },
    loginId: String,
    section: String,
    lastActivity: Date,
    totalActivity: String,
  },
  { collection: "users" } // map this schema to the users collection
);

export default userSchema;


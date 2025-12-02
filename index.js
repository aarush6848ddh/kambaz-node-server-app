import "dotenv/config";
import express from 'express';
import mongoose from "mongoose"; // Load the mongoose Library
import cors from 'cors';
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
console.log("=== MongoDB Connection Debug ===");
console.log("DATABASE_CONNECTION_STRING env var exists:", !!process.env.DATABASE_CONNECTION_STRING);
console.log("Using connection string:", CONNECTION_STRING.replace(/:[^:@]+@/, ':****@'));
console.log("Is Atlas connection?", CONNECTION_STRING.includes('mongodb+srv://'));
mongoose.connect(CONNECTION_STRING); // connect to the kambaz database

const app = express();

// Normalize CLIENT_URL by removing trailing slash for CORS matching
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const normalizedClientUrl = clientUrl.replace(/\/$/, ""); // Remove trailing slash

app.use(
  cors({
    credentials: true,
    origin: normalizedClientUrl,
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);


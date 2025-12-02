import model from "./model.js";
import db from "../Database/index.js"; // This import might be from a previous array-based DAO
import { v4 as uuidv4 } from "uuid";

export const createUser = async (user) => {
  const newUser = { ...user, _id: uuidv4() }; // insert new user into the database
  console.log("DAO createUser - creating user with _id:", newUser._id);
  try {
    const created = await model.create(newUser);
    console.log("DAO createUser - user created in MongoDB:", created);
    return created;
  } catch (error) {
    console.error("DAO createUser - MongoDB error:", error);
    throw error;
  }
};
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) => model.findOne({ username: username });
export const findUserByCredentials = (username, password) => model.findOne({ username, password });
export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });

export const findUsersEnrolledInCourse = async (courseId) => {
  // Temporary implementation using Database until enrollments are migrated to MongoDB
  const { enrollments } = db;
  const enrolledUserIds = enrollments
    .filter((enrollment) => enrollment.course === courseId)
    .map((enrollment) => enrollment.user);
  return model.find({ _id: { $in: enrolledUserIds } });
};

export const findUsersByRole = (role) => model.find({ role: role });

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    $or: [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ],
  });
};


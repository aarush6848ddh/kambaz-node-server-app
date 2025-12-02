import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (user) => {
  const newUser = { ...user, _id: uuidv4() };
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
  const enrollments = await enrollmentModel.find({ course: courseId });
  const enrolledUserIds = enrollments.map((enrollment) => enrollment.user);
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


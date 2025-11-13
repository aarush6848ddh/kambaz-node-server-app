import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  Database.users = [...Database.users, newUser];
  return newUser;
};

export const findAllUsers = () => Database.users;

export const findUserById = (userId) => Database.users.find((user) => user._id === userId);

export const findUserByUsername = (username) => Database.users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) =>
  Database.users.find((user) => user.username === username && user.password === password);

export const updateUser = (userId, user) => {
  Database.users = Database.users.map((u) => (u._id === userId ? user : u));
  return Database.users.find((u) => u._id === userId);
};

export const deleteUser = (userId) => {
  Database.users = Database.users.filter((u) => u._id !== userId);
};

export const findUsersEnrolledInCourse = (courseId) => {
  const { users, enrollments } = Database;
  const enrolledUserIds = enrollments
    .filter((enrollment) => enrollment.course === courseId)
    .map((enrollment) => enrollment.user);
  return users.filter((user) => enrolledUserIds.includes(user._id));
};


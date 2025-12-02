import model from "./model.js";

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

export function enrollUserInCourse(userId, courseId) {
  return model.create({ _id: `${userId}-${courseId}`, user: userId, course: courseId });
}

export function unenrollUserFromCourse(userId, courseId) {
  return model.deleteOne({ user: userId, course: courseId });
}

export function findAllEnrollments() {
  return model.find();
}

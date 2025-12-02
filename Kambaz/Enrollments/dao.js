import model from "./model.js";

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

export async function enrollUserInCourse(userId, courseId) {
  // Use findOneAndUpdate with upsert to avoid duplicate key errors
  const enrollment = await model.findOneAndUpdate(
    { user: userId, course: courseId },
    { _id: `${userId}-${courseId}`, user: userId, course: courseId },
    { upsert: true, new: true }
  );
  return enrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
  return model.deleteOne({ user: userId, course: courseId });
}

export function findAllEnrollments() {
  return model.find();
}

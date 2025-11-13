import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  const enrollUserInCourse = (req, res) => {
    const { userId, courseId } = req.params;
    dao.enrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  };

  const unenrollUserFromCourse = (req, res) => {
    const { userId, courseId } = req.params;
    dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(200);
  };

  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}


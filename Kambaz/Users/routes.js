import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    console.log("Create user - currentUser:", currentUser);
    console.log("Create user - role:", currentUser?.role);
    if (!currentUser || (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")) {
      console.log("Create user - 403 Forbidden");
      res.sendStatus(403);
      return;
    }
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };
  
  const deleteUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    console.log("Delete user - currentUser:", currentUser);
    console.log("Delete user - role:", currentUser?.role);
    if (!currentUser || (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN")) {
      console.log("Delete user - 403 Forbidden");
      res.sendStatus(403);
      return;
    }
    const { userId } = req.params;
    await dao.deleteUser(userId);
    res.sendStatus(200);
  };
  
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
    } else if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
    } else {
      const users = await dao.findAllUsers();
      res.json(users);
    }
  };
  
  const findUserById = async (req, res) => {
    const { userId } = req.params;
    const user = await dao.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  };
  
  const findUsersEnrolledInCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await dao.findUsersEnrolledInCourse(courseId);
    res.json(users);
  };
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.status(401).json({ message: "You must be logged in to update a user" });
      return;
    }
    
    // Allow users to update their own profile, or faculty/admin to update any user
    const canUpdate = String(currentUser._id) === String(userId) || currentUser.role === "FACULTY" || currentUser.role === "ADMIN";
    
    if (!canUpdate) {
      res.status(403).json({ message: "You do not have permission to update this user" });
      return;
    }
    
    try {
      await dao.updateUser(userId, userUpdates);
      // Update session if updating own profile
      if (currentUser._id === userId || String(currentUser._id) === String(userId)) {
        req.session["currentUser"] = { ...currentUser, ...userUpdates };
        res.json(req.session["currentUser"]);
      } else {
        const updatedUser = await dao.findUserById(userId);
        if (updatedUser) {
          res.json(updatedUser);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses/:courseId/users", findUsersEnrolledInCourse);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.post("/api/users/current/courses", createCourse);
}


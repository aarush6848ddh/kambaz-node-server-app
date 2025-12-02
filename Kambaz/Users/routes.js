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
    try {
      const newUser = await dao.createUser(req.body);
      console.log("Create user - successfully created:", newUser);
      res.json(newUser);
    } catch (error) {
      console.error("Create user - error:", error);
      res.status(500).json({ message: "Failed to create user", error: error.message });
    }
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
  
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    const currentUser = req.session["currentUser"];
    
    console.log("Update user - currentUser:", currentUser);
    console.log("Update user - userId:", userId);
    console.log("Update user - currentUser role:", currentUser?.role);
    console.log("Update user - currentUser _id:", currentUser?._id);
    
    if (!currentUser) {
      res.status(401).json({ message: "You must be logged in to update a user" });
      return;
    }
    
    // Allow users to update their own profile, or faculty/admin to update any user
    const canUpdate = String(currentUser._id) === String(userId) || currentUser.role === "FACULTY" || currentUser.role === "ADMIN";
    
    console.log("Update user - canUpdate:", canUpdate);
    
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
    try {
      const user = await dao.findUserByUsername(req.body.username);
      if (user) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
      console.log("Signup - creating user with data:", req.body);
      const currentUser = await dao.createUser(req.body);
      console.log("Signup - user created successfully:", currentUser);
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ 
        message: error.message || "Failed to create user",
        error: error.toString(),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      });
    }
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

  const findCoursesForUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // If admin, return all courses
    if (currentUser.role === "ADMIN") {
      const courses = await courseDao.findAllCourses();
      res.json(courses);
      return;
    }
    
    let { userId } = req.params;
    if (userId === "current") {
      userId = currentUser._id;
    }
    
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = await courseDao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.get("/api/users/:userId/courses", findCoursesForUser);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.post("/api/users/current/courses", createCourse);
}

const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
}; // object state persists as Long
// as server is running
// changes to the object persist
// rebooting server
// resets the object

const module = {
  id: "M1",
  name: "Node.js Basics",
  description: "Introduction to Node.js and Express.js",
  course: "CS4550",
};

export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  const getAssignmentTitle = (req, res) => {
    res.json(assignment.title);
  };
  const setAssignmentTitle = (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  };
  const setAssignmentScore = (req, res) => {
    const { newScore } = req.params;
    assignment.score = parseInt(newScore);
    res.json(assignment);
  };
  const setAssignmentCompleted = (req, res) => {
    const { completed } = req.params;
    assignment.completed = completed === "true";
    res.json(assignment);
  };
  
  // Module routes
  const getModule = (req, res) => {
    res.json(module);
  };
  const getModuleName = (req, res) => {
    res.json(module.name);
  };
  const setModuleName = (req, res) => {
    const { newName } = req.params;
    module.name = newName;
    res.json(module);
  };
  const setModuleDescription = (req, res) => {
    const { newDescription } = req.params;
    module.description = newDescription;
    res.json(module);
  };
  
  // Assignment routes
  app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
  app.get("/lab5/assignment/score/:newScore", setAssignmentScore);
  app.get("/lab5/assignment/completed/:completed", setAssignmentCompleted);
  app.get("/lab5/assignment/title", getAssignmentTitle);
  app.get("/lab5/assignment", getAssignment);
  
  // Module routes
  app.get("/lab5/module/description/:newDescription", setModuleDescription);
  app.get("/lab5/module/name/:newName", setModuleName);
  app.get("/lab5/module/name", getModuleName);
  app.get("/lab5/module", getModule);
  
  // changes to objects in the server
  // persist as long as the server is running
  // rebooting the server resets the object state
  // use .json() instead of .send() if you know
  // the response is formatted as JSON
};


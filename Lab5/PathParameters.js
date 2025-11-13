export default function PathParameters(app) {
  const add = (req, res) => {
    const { a, b } = req.params; // Retrieve path parameters as strings
    const sum = parseInt(a) + parseInt(b); // Parse as integers and add
    res.send(sum.toString()); // Send sum back as string
  };
  const subtract = (req, res) => {
    const { a, b } = req.params; // Retrieve path parameters as strings
    const result = parseInt(a) - parseInt(b); // Parse as integers and subtract
    res.send(result.toString()); // Send subtraction as string back as response
  };
  const multiply = (req, res) => {
    const { a, b } = req.params; // Retrieve path parameters as strings
    const result = parseInt(a) * parseInt(b); // Parse as integers and multiply
    res.send(result.toString()); // Send multiplication as string back as response
  };
  const divide = (req, res) => {
    const { a, b } = req.params; // Retrieve path parameters as strings
    const result = parseInt(a) / parseInt(b); // Parse as integers and divide
    res.send(result.toString()); // Send division as string back as response
  };
  app.get("/lab5/add/:a/:b", add); // Route expects 2 path parameters after /lab5/add
  app.get("/lab5/subtract/:a/:b", subtract); // Route expects 2 path parameters after /lab5/subtract
  app.get("/lab5/multiply/:a/:b", multiply); // Route expects 2 path parameters after /lab5/multiply
  app.get("/lab5/divide/:a/:b", divide); // Route expects 2 path parameters after /lab5/divide
}


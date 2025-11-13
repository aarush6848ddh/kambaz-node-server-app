export default function Hello(app) { // function accepts app reference to express module
  // to create routes here. We could have used the new
  // arrow function syntax instead
  const sayHello = (req, res) => { res.send("Life is good!"); };
  const sayWelcome = (req, res) => { res.send("Welcome to Full Stack Development!"); };
  app.get("/hello", sayHello);
  app.get("/", sayWelcome);
}

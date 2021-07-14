// For importing modules
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// middleware to verify token {function}
function verifyToken(req, res, next) {
  // Get the Auth header value
  const authHeader = req.headers["authorization"];
  // Check if bearer is unidentified
  if (typeof authHeader !== "undefined") {
    // Split at the space
    const bearer = authHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
// Express stuff
const port = process.env.PORT || 80;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for serving static files only
app.use("/public", express.static(path.join(__dirname, "/public")));
// Set the template engine as pug
app.set("view engine", "pug");
// set the views directory
app.set("views", path.join(__dirname, "views"));

const questions = [
  {
    id: 1,
    name: "Who is the P.M. of India ?",
    option_1: "Narendra Modi",
    option_2: "Nirav Modi",
    option_3: "Dr. Manmohan Singh",
    option_4: "Sonia Gandhi",
  },
  {
    id: 2,
    name: "Who is the President of U.S.A. ?",
    option_1: "Barak Obama",
    option_2: "john Bido",
    option_3: "Dr. Manmohan Singh",
    option_4: "Donald Trump",
  },
  {
    id: 3,
    name: "Who is the founder of Microsoft ?",
    option_1: "Sachin Tendulkar",
    option_2: "Sundar Pichai",
    option_3: "Gautam Gambir",
    option_4: "Bill Gates",
  },
];

// +++++++++++++++++++++++++++++++++ FOR ENDPOINTS +++++++++++++++++++++++
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/quiz", (req, res) => {
  res.render("demo.pug", { questions: questions });
});

app.get("/quiz", (req, res) => {
  res.render("demo.pug", { questions: questions });
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.render("finish.pug");
});

// --------------------------------------------------------------------------
//                     for api or microservices
// --------------------------------------------------------------------------

// To create a new user
app.post("/api/register", (req, res) => {
  res.json({
    name: req.body.username,
    password: req.body.password,
    registered: true,
  });
});

// To log in a user
app.post("/api/login", (req, res) => {
  const token = jwt.sign({ username: req.body.username }, "secretKey", {
    expiresIn: "1800s",
  });
  res.json(token);
});
// To get questions
/*
app.get("/api/questions", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      console.log(authData);
      res.send(questions);
    }
  });
});
*/
// for testing purpose only
app.get("/api/questions", (req, res) => {
  res.send({
    ques: questions,
  });
});

// To submit qustions' answers
app.post("/api/answers", verifyToken, (req, res) => {
  if (!req.body.answers) {
    res.status(404).send("Please give a valid answers");
    return;
  }
  let ans = req.body.answers;
  res.send(ans);
});

// To create qustions' by admin or teacher
app.post("/api/questions", verifyToken, (req, res) => {
  if (!req.body.questions) {
    res.status(404).send("Please give a valid questions");
    return;
  }
  let ques = req.body.answers;
  res.send(ques);
});

// ++++++++++ FOR LISTENING +++++++++++++++++++++++
app.listen(port, () => console.log(`Server is listening at port ${port}`));

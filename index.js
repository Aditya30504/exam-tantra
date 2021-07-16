// For importing modules
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");


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

// set the views directory
app.set("views", path.join(__dirname, "views"));

// conneting to database
const DB = "mongodb+srv://chanshu:Casd@805131@exam-tantra.sweey.mongodb.net/exam-tantra?retryWrites=true&w=majority";
mongoose
.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
.then(() => {
  console.log("connection successful");
})
.catch((err) => console.log(err));
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
// To render html page of home
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.render("finish.pug");
});

// To render html page for login
app.get("/login", (req, res) => {
  res.send("this is login page");
});

// To render html page for register
app.get("/register", (req, res) => {
  res.send("this is sign-up page");
});

// To render html page for giving exam
app.get("/exam", (req, res) => {
  res.send("this is exam page");
});

// To render html page for conduncting exam
app.get("/conduct_exam",(req, res) => {
  res.send("rendering html page for creating exams ");
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
// To get exam's questions along with instructions
/*
app.get("/api/exam", verifyToken, (req, res) => {
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
// To get exam's questions along with instructions
app.get("/api/exam", (req, res) => {
  let exam_code = req.body.exam_code;
  res.send({
    ques: questions,
  });
});

// To submit qustions' answers
app.post("/api/exam", verifyToken, (req, res) => {
  if (!req.body.answers) {
    res.status(404).send("Please give a valid answers");
    return;
  }
  let ans = req.body.answers;
  res.send(ans);
});

// To submit qustions' by admin or teacher
app.post("/api/conduct_exam", verifyToken, (req, res) => {
  if (!req.body.exam) {
    res.status(404).send("Please give a valid questions");
    return;
  }
  let ques = req.body.exam;
  res.send(ques);
});
// ++++++++++ FOR LISTENING +++++++++++++++++++++++
app.listen(port, () => console.log(`Server is listening at port ${port}`));

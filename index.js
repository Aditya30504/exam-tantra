// For importing modules
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const Exam = require("./models/examSchema");
const Response = require("./models/responseSchema");
const CorrectAns = require("./models/correctAnsSchema");
const User = require("./models/userSchema");

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
const DB =
  "mongodb+srv://chanshu:Casd@805131@exam-tantra.sweey.mongodb.net/exam-tantra?retryWrites=true&w=majority&ssl=true";
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
app.get("/conduct_exam", (req, res) => {
  res.send("rendering html page for creating exams ");
});

// To render html page for response
app.get("/conduct_exam", (req, res) => {
  res.send("rendering html page for creating exams ");
});
// --------------------------------------------------------------------------
//                     for api or microservices
// --------------------------------------------------------------------------
// To find a user
app.get("/api/user/:username", (req, res) => {
  User.findOne({ name: req.params.username }).then((user) => {
    if (user) {
      res.json({
        message: "yes",
      });
    } else {
      res.json({
        message: "no",
      });
    }
  });
});

// To create a new user
app.post("/api/register", (req, res) => {
  user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  user.save().then((result) => {
    res.sendStatus(200);
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
app.get("/api/exam/:exam_code", (req, res) => {
  Exam.findOne({ code: req.params.exam_code }).then((exam) => {
    if (exam) {
      res.json({
        exam: exam,
      });
    } else {
      res.sendStatus(403);
    }
  });
});

// To submit qustions' answers
app.post("/api/exam/:code", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const ans = req.body.answers;

      const ansResponse = new Response({
        answers: ans.answers,
        code: req.params.code,
        conducted_by:ans.conducted_by,
        submitted_by: authData.username,
        title: ans.title,
      });
      ansResponse.save().then(() => res.json({ message: "Submitted" }));
    }
  });
});

// To submit qustions' by admin or teacher
app.post("/api/conduct_exam", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let examResp = req.body.exam;
      const correct_ans = new CorrectAns({
        code: examResp.title + authData.username,
        ans: examResp.answers,
      });

      correct_ans.save();

      const exam = new Exam({
        code: examResp.title + authData.username,
        conducted_by: authData.username,
        duration: examResp.duration,
        schedule_time: examResp.schedule_time,
        title: examResp.title,
        questions:examResp.questions
      });
      exam
        .save()
        .then(() => res.json({ message: examResp.title + authData.username }));
    }
  });
});
// To get respones of students
app.get("/api/response", (req, res) => {
  Response.find().then((resp) => {
    res.json({
      response: resp,
    });
  });
});
app.get("/api/correct_answers/:code",(req,res)=>{
  CorrectAns.findOne({
    'code':req.params.code
  }).then((resp)=>{
    if(resp){
      res.json({
        correct_ans:resp
      })
    }else{
      res.sendStatus(403);
    }
  })
})
// ++++++++++ FOR LISTENING +++++++++++++++++++++++
app.listen(port, () => console.log(`Server is listening at port ${port}`));

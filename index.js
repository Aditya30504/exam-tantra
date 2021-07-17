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
  res.send("home.html");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.render("finish.pug");
});

// To render html page for login
app.get("/login", (req, res) => {
  res.send("login.html");
});

// To render html page for register
app.get("/register", (req, res) => {
  res.send("register.html");
});

// To render html page for giving exam
app.get("/exam", (req, res) => {
  res.send("exam.html");
});

// To render html page for conduncting exam
app.get("/conduct_exam", (req, res) => {
  res.send("conduct_exam.html");
});

// To render html page for response
app.get("/response", (req, res) => {
  res.send("response.html");
});
// --------------------------------------------------------------------------
//                     for api or microservices
// --------------------------------------------------------------------------
// To find a user
app.get("/api/user/:username", (req, res) => {
  User.findOne({ name: req.params.username }).then((user) => {
    if (user) {
      res.send(user);
    } else {
      // Not found
      res.sendStatus(404);
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
    res.send(result);
  })
});

// To log in a user
app.post("/api/login", (req, res) => {
  const token = jwt.sign({ username: req.body.username }, "secretKey", {
    expiresIn: "28800s",
  })
  res.send(token);
});

// To get exam's questions along with instructions
app.get("/api/exam/:exam_code", (req, res) => {
  Exam.findOne({ code: req.params.exam_code }).then((exam) => {
    if (exam) {
      res.json({
        exam: exam,
      });
    } else {
      // Not found
      res.sendStatus(404);
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
        conducted_by: ans.conducted_by,
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

      const exam = new Exam({
        code: examResp.title + authData.username,
        conducted_by: authData.username,
        duration: examResp.duration,
        schedule_time: examResp.schedule_time,
        title: examResp.title,
        questions: examResp.questions,
      });

      const correct_ans = new CorrectAns({
        code: examResp.title + authData.username,
        ans: examResp.answers,
      });
      correct_ans.save();
      exam
        .save()
        .then(() => res.send(examResp.title + authData.username));
    }
  })
});

// To get respones of students
app.get("/api/response", (req, res) => {
  Response.find().then((resp) => {
    if (resp) {
      res.send(resp); 
    } else {
      // Not found
      res.sendStatus(403);
    }
  })
});

// To get correct answers
app.get("/api/correct_answers/:code", (req, res) => {
  CorrectAns.findOne({
    code: req.params.code,
  }).then((resp) => {
    if (resp) {
      res.json({
        correct_ans: resp,
      })
    } else {
      // Not found
      res.sendStatus(404);
    }
  })
});


// ++++++++++ FOR LISTENING +++++++++++++++++++++++
app.listen(port, () => console.log(`Server is listening at port ${port}`));

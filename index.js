// For importing modules
const express = require("express");
const path = require("path");

// Express stuff
const port = process.env.PORT || 80;
const app = express();
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
    option_1:"Narendra Modi",
    option_2:"Nirav Modi",
    option_3:"Dr. Manmohan Singh",
    option_4:"Sonia Gandhi"
  },
  {
    id: 2,
    name: "Who is the President of U.S.A. ?",
    option_1:"Barak Obama",
    option_2:"john Bido",
    option_3:"Dr. Manmohan Singh",
    option_4:"Donald Trump"
  },
  {
    id: 3,
    name: "Who is the founder of Microsoft ?",
    option_1:"Sachin Tendulkar",
    option_2:"Sundar Pichai",
    option_3:"Gautam Gambir",
    option_4:"Bill Gates"
  },
];



// +++++++++++++++++++++++++++++++++ FOR ENDPOINTS +++++++++++++++++++++++
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/quiz", (req, res) => {
  res.render("demo.pug", {"questions":questions});
});


app.post("/", (req, res) => {
  console.log(req.body);
  res.render("finish.pug");
});

// --------------------------------------------------------------------------
//                     for api or microservices
// --------------------------------------------------------------------------

// To get questions
app.get("/api/questions", (req, res) => {
  res.send(questions);
});
// To submit qustions' answers
app.post("/api/questions", (req, res) => {
  if (!req.body.answers) {
    res.status(404).send("Please give a valid answers");
    return;
  }
  let ans = req.body.answers
  res.send(ans);
});


// ++++++++++ FOR LISTENING +++++++++++++++++++++++
app.listen(port, () => console.log(`Server is listening at port ${port}`));

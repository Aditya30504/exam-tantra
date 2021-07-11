// For importing modules
const express = require("express");
const path = require("path");

// Express stuff
const port = process.env.PORT || 80;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for serving static files only
app.use("/static", express.static(path.join(__dirname, "public")));
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
  res.render("demo.pug");
});

app.get("/quiz", (req, res) => {
  res.render("demo.pug", questions);
});

// app.get("/:id", (req, res) => {
//   const shortUrl = req.protocol + "://" + req.hostname + "/" + req.params.id;
//   // console.log("shortUrl : => "+shortUrl);
//   // let Url = urlmaps.find((u) => u.shortUrl === shortUrl);
//   Url.findOne({ shortUrl: shortUrl }).then((results) => {
//     // console.log(results.origUrl);
//     res.redirect(results.origUrl);
//   });
// });

// app.post("/", (req, res) => {
//   const param = {
//     title: "URL Shortner | CK STUDIO",
//     content: "URL Shortner with only 4 chars",
//     // shortUrl: req.protocol + "://" + req.hostname + "/" + shortner.short(4),
//     shortUrl: req.body.longUrl
//   };
//   res.render("demo.pug", param);
// });

// --------------------------------------------------------------------------
//                     for api or microservices
// --------------------------------------------------------------------------
/*
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    res.status(404).send("Please give a valid course name");
    return;
  }
  let course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given id was not found");
    return;
  }
  if (!req.body.name || req.body.name.length < 3) {
    res.status(404).send("Please give a valid course name");
    return;
  }
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given id was not found");
    return;
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found");
  else res.send(course);
  // res.send(req.params.id);
});
*/
// ++++++++++ FOR LISTENING +++++++++++++++++++++++
app.listen(port, () => console.log(`Server is listening at port ${port}`));

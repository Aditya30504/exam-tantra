// For importing modules
const express = require("express");
const path = require("path");
const shortner = require("./shortner");

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
const courses = [
  {
    id: 1,
    name: "node.js",
  },
  {
    id: 2,
    name: "express.js",
  },
  {
    id: 3,
    name: "Django",
  },
];

const urlmaps = [];

// +++++++++++++++++++++++++++++++++ FOR ENDPOINTS +++++++++++++++++++++++
app.get("/", (req, res) => {
  const param = {
    title: "URL Shortner | CK STUDIO",
    content: "URL Shortner with only 4 chars",
  };
  res.render("demo.pug", param);
});

app.get("/:id", (req, res) => {
  const shortUrl = req.protocol + "://" + req.hostname + "/" + req.params.id;
  // console.log("shortUrl : => "+shortUrl);
  // let Url = urlmaps.find((u) => u.shortUrl === shortUrl);
  Url.findOne({ shortUrl: shortUrl }).then((results) => {
    // console.log(results.origUrl);
    res.redirect(results.origUrl);
  });
});

app.post("/", (req, res) => {
  const param = {
    title: "URL Shortner | CK STUDIO",
    content: "URL Shortner with only 4 chars",
    // shortUrl: req.protocol + "://" + req.hostname + "/" + shortner.short(4),
    shortUrl: req.body.longUrl
  };
  res.render("demo.pug", param);
});

// --------------------------------------------------------------------------
//                     for api or microservices
// --------------------------------------------------------------------------
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
// +++++++ FOR LISTENING +++++++++++++++++++++++
app.listen(port, () => console.log(`Server is listening at port ${port}`));

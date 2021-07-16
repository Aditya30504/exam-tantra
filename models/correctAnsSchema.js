const mongoose = require("mongoose");

const CorrectAnsSchema = new mongoose.Schema({
  ans: {
    type: Array,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const CorrectAns = mongoose.model("exam-tantra", CorrectAnsSchema);
module.exports = CorrectAns;

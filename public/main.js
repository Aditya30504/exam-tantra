function checked(e) {
  return e.checked;
}
console.log("I'm Called");
function save() {
  var answers = [];
  let ans = document.getElementsByName("option"); // list of objects
  ans = Object.values(ans).filter(checked)[0]; //filtered array
  console.log(ans.value);
  answers.push(ans.value);
//   document.getElementById("h").innerText = "the ans is: " + ans2[0].value;
}

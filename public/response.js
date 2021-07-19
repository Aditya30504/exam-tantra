var table = document.getElementById("myTable");

async function getResponse() {
  const token = localStorage.getItem("token");
  const origin = document.location.origin;
  const response = await fetch(origin + "/api/response", {
    method: "POST",
    headers: {
      Authorization: "Bearer" + " " + token,
    },
  });
  // 200->OK
  if (response.ok) {
    const result = await response.arrayBuffer();
    fillData(result);
  }
  // Something went wrong
  else {
    alert("Something went wrong...");
  }
}
// helper function
function fillData(responses) {
  responses.forEach((resp, i) => {
    var row = table.insertRow(i + 1);
    const cell0 = row.insertCell(0);
    const cell1 = row.insertCell(1);
    const cell2 = row.insertCell(2);
    const cell3 = row.insertCell(3);
    const cell4 = row.insertCell(4);
    const cell5 = row.insertCell(5);
    const cell6 = row.insertCell(6);
    cell0.innerHTML = i + 1;
    cell1.innerHTML = resp.code;
    cell2.innerHTML = resp.title;
    cell3.innerHTML = resp.submitted_by;
    cell4.innerHTML = resp.correct;
    cell5.innerHTML = resp.inCorrect;
    cell6.innerHTML = resp.notAttemped;
  });
}
let array = [
  {
    correct: "10",
    inCorrect: "2",
    notAttemped: "3",
    code: "MA102sumit",
    submitted_by: "chanshu",
    title: "MA102",
  },
  {
    correct: "8",
    inCorrect: "2",
    notAttemped: "5",
    code: "MA102sumit",
    submitted_by: "balmiki",
    title: "MA102",
  },
];
// fillData(array);
setTimeout(getResponse, 3000);

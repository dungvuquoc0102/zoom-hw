fetch("http://localhost:3000/tasks/1", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Update",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));

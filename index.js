const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app
  .route("/users")
  .get((req, res) => {
    return res.json(users);
  })
  .post((req, res) => {
    const body = req.body;
    if (
      !body ||
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.gender
    )
      return res.status(400).json({ error: "all data required" });
    const newId = users[users.length - 1].id + 1;
    users.push({ id: newId, ...body });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      res.send(newId + " added");
    });
  });

app
  .route("/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => {
      return user.id === id;
    });
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const newData = req.body;
    let foundFlag = 0;
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        foundFlag = 1;
        return { ...user, ...newData };
      }
      return user;
    });
    if (!foundFlag) return res.status(400).json({ error: "user not found" });
    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(updatedUsers),
      (err, data) => {
        res.send(id + " updated");
      }
    );
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const updatedUsers = users.filter((user) => {
      return user.id !== id;
    });
    if (users.length === updatedUsers.length)
      return res.status(400).json({ error: "user not exist" });
    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(updatedUsers),
      (err, data) => {
        if (err) {
          return res.send(err);
        }
        return res.send(id + " deleted");
      }
    );
  });

app.listen(PORT, () => {
  console.log("server running at localhost:8000");
});

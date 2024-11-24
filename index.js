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
    users.push({ id: users.length + 1, ...body });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      res.send(users.length + " added");
    });
  });

app
  .route("/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => {
      return user.id === id;
    });
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const newData = req.body;
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, ...newData };
      }
      return user;
    });

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

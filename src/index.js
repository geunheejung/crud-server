const express = require("express");
const { signUp, login } = require("./routes/user.js");

const app = express();

app.use(express.json());

app.set("port", process.env.PORT || 3000);

app.post("/sign-up", signUp);

app.post("/login", login);

app.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});

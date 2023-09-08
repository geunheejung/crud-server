const app = require("./express.js");
const { signUp, login } = require("./routes/user.js");

app.set("port", process.env.PORT || 3000);

app.post("/sign-up", signUp);

app.post("/login", login);

app.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});

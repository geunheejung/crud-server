require("dotenv").config();

const app = require("./express.js");
const { signUp, login } = require("./routes/auth.js");
const { getUser } = require("./routes/member.js");
const { route } = require("./route.js");

app.set("port", process.env.PORT || 3000);

app.post(route.signup, signUp);

app.post(route.login, login);

app.get(route.user, getUser);

app.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});

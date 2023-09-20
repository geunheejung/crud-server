require("dotenv").config();

const app = require("./express.js");
const { signUp, login, refresh } = require("./routes/auth.js");
const { getUser } = require("./routes/member.js");
const { route } = require("./route.js");
const redis = require("./redis.js");
const redisClient = require("./redis.js");

redis.on("connect", () => {
  console.info("Redis connected!");
});
redis.on("error", (err) => {
  console.error("Redis Client Error", err);
});
redisClient.connect().then();

app.set("port", process.env.PORT || 3000);

app.get(route.refresh, refresh);

app.post(route.signup, signUp);

app.post(route.login, login);

app.get(route.user, getUser);

app.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});

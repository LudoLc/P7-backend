const express = require("express");
const { xss } = require("express-xss-sanitizer"); // empêche les injections xss (un code injecté pourra être lu mais pas interpreté par le code)
require("dotenv").config();
const app = express();
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
const comment = require("./routes/comment");
const reactions = require("./routes/reactions");

require("./models/Role");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use(express.json());
app.use(xss());
app.use('/public', express.static("public"))
app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/posts", post);
app.use("/api/comments", comment);
app.use("/api/reactions", reactions);
app.all("*", (req, res) => {
  res.send('{"message": "Bad Request"}');
});
app.listen(process.env.PORT || "3000", () => {
  console.log("Server lancé sur le localhost:3000");
});

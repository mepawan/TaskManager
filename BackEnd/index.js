require("./passport");
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
//const authModel = require("./Models/Model");
//const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
//const TodoRoutes = require("./Routes/TodoRoutes");
//const NoteRoutes = require("./Routes/NoteRoutes");
const TaskRoutes = require("./Routes/TaskRoutes");
const AuthkRoutes = require("./Routes/AuthRoutes");

const PORT = 8080;

const app = express();
app.use([
  cors({
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "PUT", "DELETE"],
  }),
  express.json(),
  express.urlencoded({ extended: true }),
]);

const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "session",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json(" hello ");
});

app.use("/auth", AuthkRoutes);

const authenticator = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Login Required" });
  }
  next();
};

app.use("/task", [authenticator, TaskRoutes]);

app.listen(PORT, () => {
  console.log(`Server Running On Port : ${PORT} `);
});

module.exports = app;

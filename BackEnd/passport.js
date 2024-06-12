const passport = require("passport");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const authModel = require("./Models/AuthModel");
const bcrypt = require("bcrypt");


const LocalStrategycallback = (email, password, done) => {
  authModel
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      const isValid = bcrypt.compare(password, user.password);
      isValid.then((val) => {
        if (val) return done(null, user);
        return done(null, false, { message: "incorrect password" });
      });
    })
    .catch((err) => {
      return done(err);
    });
};

passport.use(
  new LocalStrategy({ usernameField: "email" }, LocalStrategycallback)
);

// //Serializing and Deserializing
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  authModel
    .findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
  // return done(null, id);
});

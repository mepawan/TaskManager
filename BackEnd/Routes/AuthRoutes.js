const authRoutes = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const authModel = require("../Models/AuthModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

authRoutes.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newAuth = new authModel({
    userName: userName,
    email: email,
    password: hashedPassword,
  });

  try {
    const user = await authModel.findOne({ email: email });
    if (user) res.json("Already Registerd");
    else {
      const savedUser = await newAuth.save();
      res.send(savedUser);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});


//Local Login
authRoutes.post(
  "/login",

  passport.authenticate('local', { failWithError: true }),
  function(req, res, next) {
    // handle success
    let user = {id:req.user._id, username:req.user.userName, email:req.user.email};
    return res.json({ status :"success", msg: "successfully logged in",user:user });
  },
  function(err, req, res, next) {
    // handle error
    return res.json({ status :"error", msg: err });
  }

/*
  passport.authenticate("local", {
    failWithError: true
    //failureRedirect: process.env.FRONTEND_DOMAIN,
    //return res.json({ success: "successfully logged in",user:user })
  }),
  (req, res) => {
    let user = {id:req.user._id, username:req.user.userName, email:req.user.email};
    res.json({ status :"success", msg: "successfully logged in",user:user });
  }
    */
);

//logout
authRoutes.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) res.send(err);
    else res.json({ success: "logged out" });
  });
});

authRoutes.get("/getUser", (req, res, next) => {
  if (req.user) {
    res.json(req.user);
  }
});

//Forgot and reset password
authRoutes.post("/resetPassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(id);
  const { newPassword } = req.body;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, encode) => {
    if (err) return res.json({ status:"error",msg: "Invalid token" }); 
    else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      authModel
        .findByIdAndUpdate({ _id: id }, { password: hashedPassword })
        .then((u) =>  res.json({ status:"success",msg: "Password reset successfully" }) )
        .catch((err) => res.json({ status:"error",msg: err}));
    }
  });
});

authRoutes.post("/forgotpass", async (req, res) => {
  const { email } = req.body;
  await authModel.findOne({ email: email }).then((user) => {
    if (!user) return res.send({ Status: "Enter a valid email" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    var transporter = nodemailer.createTransport({
      //service: "gmail",
      host: "smtp.mailersend.net",
      port: 587,
      secure: false,
      auth: {
        user: "MS_W9lOkm@trial-3z0vklozxd147qrx.mlsender.net",
        pass: "zP0mkV6c7dp19WTW",
      },
    });

    var mailOptions = {
      from: "MS_W9lOkm@trial-3z0vklozxd147qrx.mlsender.net",
      to: email,
      subject: "Forgot password for task manager",
      text: `Hi,<br />Please click on link below to reset your password.<br /><br />${process.env.FRONTEND_DOMAIN}/ResetPass/${user._id}/${token}<br /><br />Thanks`,
    };
 
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "success" });
      }
    });
  });
});

module.exports = authRoutes;

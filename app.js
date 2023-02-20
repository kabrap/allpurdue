require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require('md5');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/allPurdueDB");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'yashnarainagarwal@gmail.com',
    pass: 'process.env.APP_PASS'
  }
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// User Schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      validate: {
        validator: validateEmail,
        message: () => "Email address already registered.",
      },
      required: [true, "User email required"],
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    }
  },
  { timestamps: true }
);

async function validateEmail(email) {
  const user = await User.findOne({ email });
  if (user) {
    if (User.id === user.id) {
      return true;
    }
    return false;
  }
  return true;
}

// Simple User Collection
const User = new mongoose.model("User", schema);

// GET Route for Homes
app.get('/', function (req, res) {
  res.render("home");
});

// GET Route for Register
app.get('/register', function (req, res) {
  res.render("register");
})

// GET Route for Landing
app.get('/landing', function (req, res) {
  if (!req.session.user) {
    res.render("login");
  } else {
    res.render("landing");
  }
})

// POST Route for Register
app.post('/register', function (req, res) {
  const newUser = new User({
    name: req.body.name,
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log("User Successfully Registered!");
      res.render("login");
    }
  });
});

// POST Route for Login
app.post('/login', function (req, res) {
  var username = req.body.username;
  var userPass = md5(req.body.password);

  User.findOne({ email: username }, function (err, userExists) {
    if (err) {
      console.log(err);
    } else {
      if (userExists) {
        if (userExists.password === userPass) {
          console.log("User Successfully Logged In!");
          req.session.user = userExists;
          res.redirect("/landing");
        } else {
          console.log("Incorrect Password!");
          res.redirect("login");
        }
      }
    }
  }
  );
});

// GET Route for /forgotPassword
app.get("/forgotPassword", function (req, res) {
  res.render("forgotPassword");
});

global.resetUser;

// POST Route for /forgotPassword
app.post("/forgotPassword", function (req, res) {
  const userEmail = req.body.username;
  User.findOne({ email: userEmail }, function (err, userExists) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      if (userExists) {
        const secret = process.env.JWT_SECRET + userExists.password;
        const payload = {
          email: userEmail,
          id: userExists.id
        };
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        resetUser = userExists;
        const link = `http://localhost:3000/reset-password/${userExists.id}/${token}`;
        console.log(userEmail);
        const msg = {
          from: 'yashnarainagarwal@gmail.com',
          to: userEmail,
          subject: 'AllPurdue Password Reset',
          text: `Hello from AllPurdue! Boiler Up! Please click the link to reset your email:\n${link}.\n The link is only valid for 15 minutes.`
        }
        transporter.sendMail(msg, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        res.send("Link Sent Successfuly! Check your inbox!");
      } else {
        console.log("User not found!");
        res.redirect("/forgotPassword");
      }
    }
  });
});

app.get("/reset-password/:id/:token", function (req, res) {
  const { id, token } = req.params;
  if (id === global.resetUser.id) {
    const secret = process.env.JWT_SECRET + global.resetUser.password;
    try {
      jwt.verify(token, secret);
      console.log("Verified");
      //res.render("reset-password", {email: global.resetUser.email});
      res.send("Verification Successful!");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Verification Failed");
    res.sendStatus(500);
  }
});

// GET Route for Login
app.get('/login', function (req, res) {
  res.render("login");
})

// GET Route for Landing
app.get('/landing', function (req, res) {
  res.render("landing");
})

app.listen(3000, function () {
  console.log("Server started at Port 3000!");
});
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require('md5');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/allPurdueDB");
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'allpurdue2023@gmail.com',
    pass: process.env.APP_PASS,
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

app.use(passport.initialize());
app.use(passport.session());

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
      minLength: 6
    },
    googleId: {
      type: String
    }
  },
  { timestamps: true }
);

schema.plugin(findOrCreate);

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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/allpurdue",
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value }, function (err, user) {
    if(err) {
      console.log(err);
    }
    return cb(err, user);
  });
}
));

// GET Route for Homes
app.get('/', function (req, res) {
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile", "email"] })
);

app.get("/auth/google/allpurdue",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res, err) {
    res.redirect("/landing");
  });


// GET Route for Register
app.get('/register', function (req, res) {
  res.render("register");
})

// GET Route for Landing
app.get('/landing', function (req, res) {
  if (!req.session.user && !req.isAuthenticated()) {
    res.render("login");
  } else {
    res.render("landing");
  }
})

// POST Route for Register
app.post('/register', function (req, res) {
  if(req.body.password.length < 6) {
    console.log("Password length is less than 6!");
    return res.redirect('/register');
  }
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
          from: '"Team AllPurdue" allpurdue2023@gmail.com',
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
        console.log("Link Sent Successfuly! Check your inbox!");
        res.redirect('/');
      } else {
        console.log("User not found!");
        res.redirect("/forgotPassword");
      }
    }
  });
});

app.get("/reset-password/:id/:token", async function (req, res) {
  const { id, token } = req.params;
  if (id === global.resetUser.id) {
    const user = await User.findOne({email: global.resetUser.email});
    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
      console.log("Verified");
      res.render("reset-password", {email: global.resetUser.email});
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Verification Failed");
    res.sendStatus(500);
  }
});

app.post("/reset-password", function (req, res) {
  const update = {
    password: md5(req.body.password)
  };
  const filter = {
    email: global.resetUser.email
  }
  User.findOneAndUpdate(filter, update, function(err) {
    if(err) {
      console.log(err)
    } else {
      console.log("Password Updated Successfully!");
      res.redirect("/login");
    }
  })
});

app.get("/logout", async function(req, res) {
  req.session.user = null;
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
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
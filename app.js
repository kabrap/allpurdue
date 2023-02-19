require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require('md5');
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/allPurdueDB");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// TODO: Keep this in this file - change a little
// GET Route for Home Page
app.get('/', function(req, res){
    res.render("home");
});

// const { User } = require("./models/userModels.js"); 

/* ---------- [Start] Models ---------- */

const Schema = mongoose.Schema;

// User Schema

const userSchema = new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
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
      },
    },
    { timestamps: true }
  );
  
  const User = new mongoose.model("User", userSchema);
  
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

// Place Schema

const placeSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      placeType: {
        type: String,
        required: true,
      },
      tags: [{
        type: String
      }],
      location: { // Reference - https://mongoosejs.com/docs/geojson.html
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      // TODO: Ratings, Average Rating and Reviews, and Similar Places (i think that is a FE issue)
    },
    { timestamps: true }
  );
  
  const Place = new mongoose.model("Place", placeSchema);

/* ---------- [End] Models ---------- */

// GET Route for Register
app.get('/register', function(req, res) {
    res.render("register");
})

// POST Route for Register
app.post('/register', function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'email already exists' });
        } else {
            res.render("landing");
        }
    });
});

// POST Route for Login
app.post('/login', function(req, res) {
    var username = req.body.username;
    var userPass = md5(req.body.password); 

    User.findOne({email: username}, function(err, userExists) {
            if (err) {
                console.log(err);
            } else {
                if (userExists) {
                    if (userExists.password === userPass) {
                        res.render("landing");
                    } else {
                        console.log("password mismatch");
                        res.redirect("login");
                    }
                }
            }
        }
    );
});

// GET Route for Login
app.get('/login', function(req, res) {
    res.render("login");
})

// GET Route for Landing
app.get('/landing', function(req, res) {
    res.render("landing");
})

app.listen(3000, function() {
    console.log("Server started at Port 3000!");
});
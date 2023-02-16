require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/allPurdueDB");


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Basic Schema
const schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    }, 
    password: String
});

schema.plugin(encrypt, { 
    secret: process.env.SECRET,
    encryptedFields: ['password']
});

// Simple User Collection
const User = new mongoose.model("User", schema);

// GET Route for Homes
app.get('/', function(req, res){
    res.render("home");
});

// GET Route for Register
app.get('/register', function(req, res) {
    res.render("register");
})

// POST Route for Register
app.post('/register', function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
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
    var userPass = req.body.password; 

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
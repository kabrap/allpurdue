const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/allPurdueDB");


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Basic Schema
const schema = new mongoose.Schema({
    email: String,
    password: String
});

// Simple User Collection
const User = new mongoose.model("User", schema);


app.get('/', function(req, res){
    res.render("home");
});

// GET Route for Register
app.get('/register', function(req, res) {
    res.render("register");
})

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
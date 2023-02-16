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

// Sample User for testing
const yash = new User({ email: "abc@123.com", password: "abc"});

//yash.save()

app.get('/', function(req, res){
    res.render("home");
})

app.listen(3000, function() {
    console.log("Server started at Port 3000!");
});
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://localhost:27017");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.render("home");
})

app.listen(3000, function() {
    console.log("Server started at Port 3000!");
});
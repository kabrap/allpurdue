require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const app = express();

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/allPurdueDB");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: Keep this in this file - change a little
// GET Route for Home Page
app.get("/", function (req, res) {
  res.render("home");
});

// const { User } = require("./models/userModels.js"); // Uncomment when successfully created components

/* ---------- [Start] Models ---------- */

const Schema = mongoose.Schema;

// User Schema

const userSchema = new Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      }
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
    postedReviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
    // Reference - https://mongoosejs.com/docs/populate.html#count
  },
  { timestamps: true }
);

// Using virtual populate to find reviews by users - // Reference - https://mongoosejs.com/docs/populate.html#count
// You can then populate() the author's posts as shown below.
// const user = await User.findOne().populate('reviews');
// user.posts[0].rating; // Rating of the first blog review

userSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'postedBy'
});

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
    tags: [
      {
        type: String,
      },
    ],
    location: {
      // Reference - https://mongoosejs.com/docs/geojson.html
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }]
    // TODO: Ratings, Average Rating and Reviews, and Similar Places (i think that is a FE issue)
  },
  { timestamps: true }
);

const Place = new mongoose.model("Place", placeSchema);


// Anpther virtual to find number of ratings for each place
// Usage example -
//      const doc = await Band.findOne({ name: 'Motley Crue' }).populate('numMembers');
//      doc.numMembers; // 2

placeSchema.virtual('numRatings', {
    ref: 'Review',
    localField: 'name',
    foreignField: 'place',
    count: true
})

// Reviews Schema

const reviewSchema = new Schema(
    {
      rating: {
        type: Number,
        minimum: [1, "Minimum rating of 1 is required"],
        maximum: [5, "Maximum rating of 5 is required"],
        required: true,
      },
      review: {
        type: String,
      },
      place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
      },
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      postLikeUsersList : [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }]
    },
    { timestamps: true }
  );

const Review = new mongoose.model("Review", reviewSchema);

/* ---------- [End] Models ---------- */


// for getting a place
app.get('/:id', (req, res) => {
  Place.findById(req.params.id)
  .then((place) => res.json(place))
  .catch((err) => console.log(err));
});

// for adding a place
app.post('/add', (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const type = req.body.placeType;
  const tags = req.body.tags;
  const loc = req.body.location;
  const newPlace = new Place({
    name,
    id,
    description,
    type,
    tags,
    loc
  })
  newPlace.save()
  .then(() => res.json('Place Added'))
  .catch((err) => console.log(err));
});

// for modifying a place
app.post('/modify/:id', (req, res) => {
  Place.findById(req.params.id)
  .then((place) =>{
    place.name = req.body.name;
    place.description = req.body.description;
    place.placeType = req.body.placeType;
    place.tags = req.body.tags;
    place.location = req.body.location;
    newPlace.save()
    .then(() => res.json('Place Modified'))
    .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
});

// for removing a place
app.delete('/:id', (req, res) => {
  Place.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("landing");
    }
  });
});


// GET Route for Register
app.get("/register", function (req, res) {
  res.render("register");
});

// POST Route for Register
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "email already exists" });
    } else {
      res.render("landing");
    }
  });
});

// POST Route for Login
app.post("/login", function (req, res) {
  var username = req.body.username;
  var userPass = md5(req.body.password);

  User.findOne({ email: username }, function (err, userExists) {
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
  });
});

// GET Route for Login
app.get("/login", function (req, res) {
  res.render("login");
});

// GET Route for Landing
app.get("/landing", function (req, res) {
  res.render("landing");
});

app.listen(3000, function () {
  console.log("Server started at Port 3000!");
});

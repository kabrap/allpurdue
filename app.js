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
const methodOverride = require('method-override');
const multer  = require('multer')
const path = require('path');
const fs = require('fs');

const app = express();

const cors=require("cors");
const { Router } = require('express');
const corsOptions ={
   origin:'*',
   credentials:true,
   optionSuccessStatus:200,
}

/* Multer Setup for Images */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  }
})

var upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024
  }
})

/* End multer Setup for Images */

app.use(cors(corsOptions));

mongoose.set('strictQuery', false);

// for mac
// mongoose.connect("mongodb://localhost:27017/allPurdueDB");

// for windows
 mongoose.connect("mongodb://127.0.0.1:27017/allPurdueDB");

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

app.use(methodOverride('_method'));

app.use(express.static("public"));
app.use(express.static("uploads"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

/* ---------- [Start] Models ---------- */

const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema(
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
    },
    postedReviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }],
    savedBlogs: [{
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    }],
    googleId: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.plugin(findOrCreate);

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

const User = new mongoose.model("User", userSchema);

let currentUser = null;

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
    hours: [{
      type: String,
      required: true,
    }],
    phone: {
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
    }],
    images: [
      {
        type: String,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    googleMap: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Place = new mongoose.model("Place", placeSchema);

// Anpther virtual to find number of ratings for each place
// Usage example -
//      const doc = await Band.findOne({ name: 'Motley Crue' }).populate('numMembers');
//      doc.numMembers; // 2

// placeSchema.virtual('numRatings', {
//     ref: 'Review',
//     localField: 'name',
//     foreignField: 'place',
//     count: true
// })

// Reviews Schema

const reviewSchema = new Schema(
    {
      rating: {
        type: Number,
        minimum: [1, "Minimum rating of 1 is required"],
        maximum: [5, "Maximum rating of 5 is required"],
        required: true,
      },
      text: {
        type: String,
      },
      place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      likes: {
        type: Number,
        default: 0,
      },
      likes_by: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
    },
    { timestamps: true }
  );

const Review = new mongoose.model("Review", reviewSchema);


// Blogs Schema

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    likes_by: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true }
);

Blog = new mongoose.model("Blog", blogSchema);

/* ---------- [End] Models ---------- */

/* ---------- [Start] Google Auth ---------- */

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
  scope: ['profile', 'email']
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value }, function (err, user) {
    if(err) {
      console.log(err);
    }
    currentUser = user;
    return cb(err, user);
  });
}
));

/* ---------- [End] Google Auth ---------- */

/* ---------- [Start] User Routes ---------- */

// GET route for retrieving all user data
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send( 'Error retrieving user data' );
  }
});

// GET route for getting specific user
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user)
  } catch (error) {
    console.error(error);
  }
});

/* ---------- [End] User Routes ---------- */

/* ---------- [Start] Place Routes ---------- */

app.get('/add_place', (req, res) => {
  res.render("add_place");
});

// for adding a place
app.post('/add_place', async (req, res) => {
  try {
    const { name, description, placeType, latitude, longitude } = req.body;

    // Create a new Place object
    const place = new Place({
      name,
      description,
      placeType,
      location: {
        type: 'Point',
        coordinates: [latitude, longitude],
      },
    });

    // Save the Place object to the database
    await place.save();
    res.render('landing')

  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding place');
  }
});

// GET route for displaying all places
app.get('/places', async (req, res) => {
  try {
    const places = await Place.find({});
    const placesWithAvgRating = await Promise.all(places.map(async (place) => {
      // Add average rating functionality
      const reviews = await Review.find({ place: place._id });
      const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
      const numReviews = reviews.length > 0 ? reviews.length : 0;
      const avgRating = reviews.length > 0 ? roundToNearestHalf(totalRatings / reviews.length) : 0;
      return { ...place._doc, avgRating, numReviews };
    }));
    // sending places as response
    res.send(placesWithAvgRating)
    // res.render('all_places', { places: placesWithAvgRating });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// GET route for displaying a single place by ID
app.get('/places/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('reviews');
    // Add average rating functionality
    const reviewRatings = place.reviews.map(review => review.rating);
    const averageRating = roundToNearestHalf(reviewRatings.reduce((acc, curr) => acc + curr, 0) / reviewRatings.length);

    // suggestions
    const tags = place.tags;
    const suggestedPlaces = await Place.find({tags:{$in:tags}, _id:{$ne: place._id}}).limit(5);
    // if there aren't 5 places with matching tags then we check for matching placeType
    if (suggestedPlaces.length < 5) {
      const matchingPlaceTypes = await Place.find({placeType: place.placeType, _id:{$ne: place._id}}).limit(5 - suggestedPlaces.length);
      suggestedPlaces.push(...matchingPlaceTypes);
    }

    const hours = place.hours;
    const phone = place.phone;  
    const website = place.website;
    const address = place.address;
    const googleMap = place.googleMap;
    const reviews = place.reviews;

    // sending everything as response
    const data = { place, reviewRatings, averageRating, suggestedPlaces, hours, phone, website, address, googleMap, reviews };
    res.send(data)
    //res.render('place-details', { place: place, averageRating: averageRating, numRatings: reviewRatings.length });
  } catch (error) {
    console.error(error);
    // res.redirect('/');
    res.status(400).send("Error retrieving place data")
  }
});

// // for modifying a place
// app.post('/modify/:place_id', (req, res) => {
//   Place.findById(req.params.id)
//   .then((place) =>{
//     place.name = req.body.name;
//     place.description = req.body.description;
//     place.placeType = req.body.placeType;
//     place.tags = req.body.tags;
//     place.location = req.body.location;
//     newPlace.save()
//     .then(() => res.json('Place Modified'))
//     .catch((err) => console.log(err));
//   })
//   .catch((err) => console.log(err));
// });

app.delete('/places/:place_id', (req, res) => {
  console.log("testing")
  Place.findByIdAndDelete(req.params.place_id, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Place deleted");
    }
  });
});


/* ---------- [End] Place Routes ---------- */

/* ---------- [Start] Search Routes ---------- */

// Set up the search endpoint route to handle GET requests
app.get('/search', async (req, res) => {
  try {
    //const query = req.query.q || '';
    const results = []; // No results to show yet
    //res.render('search', { results });
    res.render('search', { results, query: null });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'An error has occurred' });
  }
});

// Set up the search endpoint to handle POST requests
app.post('/search'  , async (req, res) => {
  const query = req.body.query;
  const regexQuery = new RegExp(query, 'i');
  // console.log(regexQuery);
  try {
    const results = await Place.find({
      $or: [
        { name: regexQuery },
        { placeType: regexQuery },
        { tags: regexQuery },
      ]
    }).select('name placeType tags images').limit(3);
    console.log(results);
    res.send(results)
    // if (req.xhr) {
    //   res.json({results }); // Return JSON containing the autocomplete suggestions
    // } else {
    //   res.render('search', { results });
    // }
  } catch (err) {
    console.error(err);
    // res.render('error', { message: 'An error has occurred' });
  }
});

/* ---------- [End] search Routes ---------- */

/* ---------- [Start] Reviews Routes ---------- */

// getting recent reviews
app.get('/recent-reviews', async (req, res) => {
  try {
    const recentReviews = await Review.find({})
      .populate('place', 'name tags placeType images')
      .sort({ updatedAt: -1 })
      .exec()
    
    // sending recentReviews as response
    res.send(recentReviews)
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

// Add a review
app.post('/places/:placeId/reviews', async (req, res) => {
  const placeId = req.params.placeId;
  const rating = req.body.rating;
  const text = req.body.review;
  const author = req.body.author; // assuming user ID is stored in session

  try {
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).send('Place not found');
    }

    if (rating === null || rating < 1) {
      return res.status(400).send('Please select rating of at least 1')
    }

    const review = new Review({
      rating,
      text,
      place: placeId,
      author
    });

    await review.save();

    place.reviews.push(review);
    await place.save();

    res.status(201).json(review);

  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// edit review
app.get('/places/:place_id/reviews/:id/edit', async (req, res) => {
  const reviewId = req.params.id;
  const placeId = req.params.place_id;
  // const userId = req.session.userId; // assuming user ID is stored in session

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send('Review not found');
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).send('Place not found');
    }

    // if (review.author.toString() !== userId) {
    //   return res.status(403).send('Unauthorized');
    // }

    res.render('edit-review', { review, place });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.put('/places/:place_id/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const placeId = req.params.place_id;
  // const userId = req.session.userId; // assuming user ID is stored in session
  const { rating, text } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send('Review not found');
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).send('Place not found');
    }

    // if (review.author.toString() !== userId) {
    //   return res.status(403).send('Unauthorized');
    // }

    review.rating = rating;
    review.text = text;
    await review.save();

    res.redirect(`/places/${review.place}`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// delete review
app.delete('/places/:place_id/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const placeId = req.params.place_id;
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send('Review not found');
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).send('Place not found');
    }

    await Review.findByIdAndDelete(reviewId);

    await Place.findByIdAndUpdate(
      placeId,
      { $pull: { reviews: reviewId } },
      { new: true }
    );

    res.redirect(`/places/${placeId}`);
    
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// Like and unlike a review
app.post('/reviews/:reviewId/like/:userId', async (req, res) => {
  const reviewId = req.params.reviewId;
  const user = await User.findById(req.params.userId);

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send('Review not found');
    }

    const hasLiked = review.likes_by.includes(user._id);

    if (hasLiked) {
      review.likes = review.likes - 1;
      review.likes_by.pop(user._id);
      // user.likedReviews.pop(review._id);
    } else {
      review.likes = review.likes + 1;
      review.likes_by.push(user._id);
      // user.likedReviews.push(review._id);
    }

    // Save the changes to the review and user documents
    await review.save();
    // await user.save();

    return res.json({ review });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

/* ---------- [End] Reviews Routes ---------- */

/* ---------- [Start] Blogs Routes ---------- */

// GET all blogs
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET new blog form
app.get('/blogs/new-blog', async (req, res) => {
  try {
    const users = await User.find();
    res.render('new-blog', { users });
  } catch (err) {
    console.log(err);
    res.send('Error retrieving new blog form');
  }
});

// POST new blog
app.post('/blogs', upload.array('blog-images'), async (req, res) => {
  try {
    const { title, text, author, tags } = req.body;
    const images = req.files.map((file) => file.filename);

    const newBlog = new Blog({ title, text, author, tags, images });
    const savedBlog = await newBlog.save();

    res.status(201).send(savedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET specific blog by ID
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const user = await User.findById(blog.author);
    const response = {
      ...blog.toObject(),
      authorName: user.name
    };
    res.send(response);
  } catch (err) {
    console.log(err);
    res.send('Error retrieving blog');
  }
});

// DELETE specific blog by ID
app.delete('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    var img = blog.images;
    for(var i = 0; i < img.length; i++) {
      var path = "uploads/" + img[i];
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
  } catch (err) {
    console.log(err);
    res.send('Error deleting blog');
  }
});

// Save specific blog by ID
app.post('/save-blog/:id', async (req, res) => {
  try {
    
    if (!currentUser) {
      res.send("no user logged in");
      return;
    }

    if (currentUser.savedBlogs.includes(req.params.id)) {
      currentUser.savedBlogs.pop(req.params.id);
    } else {
      currentUser.savedBlogs.push(req.params.id);
      User.findOneAndUpdate(
        { _id: currentUser._id }, 
        { savedBlogs: currentUser.savedBlogs }, function (err) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.status(201).send("success")
        }
      });
    }

  } catch (err) {
    console.log(err);
    res.send('Error saving blogs');
  }
  
});

// Get saved blogs of the current user
app.get('/saved-blogs/', async (req, res) => {
  try {
    if (!currentUser) {
      res.send('user not logged in');
      return;
    }
    res.send(currentUser.savedBlogs);
  } catch (err) {
    console.log(err);
    res.send('Error sending saved blogs');
  }
});

// GET recent blogs
app.get('/recent-blogs', async (req, res) => {
  try {
    const recentBlogs = await Blog.find({})
      // .populate('place', 'name tags placeType images') 
      // @Andrew / @Antony Add Whatever You Need In this Populate Command ^
      .sort({ updatedAt: -1 })
      .exec()
    
    // sending recentBlogs as response
    res.send(recentBlogs)
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

// PUT update an existing blog by ID
app.put("/blogs/:blogId", async (req, res) => {
  const { blogId } = req.params;
  const { title, text, places } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { title, text, places },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Like and unlike a blog
app.post('/blogs/:blogId/like/:userId', async (req, res) => {
  const blogId = req.params.blogId;
  const user = await User.findById(req.params.userId);

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    const hasLiked = blog.likes_by.includes(user._id);

    if (hasLiked) {
      blog.likes = blog.likes - 1;
      blog.likes_by.pop(user._id);
      // user.likedReviews.pop(review._id);
    } else {
      blog.likes = blog.likes + 1;
      blog.likes_by.push(user._id);
      // user.likedReviews.push(review._id);
    }

    // Save the changes to the blog and user documents
    await blog.save();
    // await user.save();

    return res.send(blog);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

/* ---------- [End] Blogs Routes ----------- */

/* ---------- [Start] Login/Register/Home/Forgot Password Routes ---------- */

// GET Route for Homes
app.get('/', function (req, res) {
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile", "email"] })
);

app.get("/auth/google/allpurdue",
  passport.authenticate('google', { failureRedirect: "http://localhost:3001/loginsignup" }),
  function(req, res, err) {
    console.log("google login")
    console.log(res.data)
    res.redirect("http://localhost:3001/");
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
  console.log(req.body);
  if(req.body.password.length < 6) {
    console.log("Password length is less than 6!");
    res.status(500).send('Password length is less than 6!');
    return;
  }
  if (req.body.username.endsWith('@purdue.edu')) {
    const link = `http://localhost:3000/verify-user/${req.body.name}/${req.body.username}/${md5(req.body.password)}`;
    const msg = {
      from: '"Team AllPurdue" allpurdue2023@gmail.com',
      to: req.body.username,
      subject: 'AllPurdue Email Verification',
      text: `Hello from AllPurdue! Boiler Up! Please click the link to verify your email:\n${link}.\n`
    }
    transporter.sendMail(msg, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render('home');
  } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.username,
        password: md5(req.body.password)
      });
      newUser.save(function (err) {
        if (err) {
          console.log(err);
          res.status(500).send('Unsuccessful registration');
        } else {
          console.log("User Successfully Registered!");
          res.render("login");
        }
      });
  }
});

app.get("/verify-user/:name/:email/:password", function(req, res) {
  console.log("User Successfully Verified!");
  const { name, email, password } = req.params;
  const newUser = new User({
    name: name,
    email: email,
    password: password
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send('Unsuccessful registration');
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
      res.status(500).send('User not found')
    } else {
      if (userExists) {
        if (userExists.password === userPass) {
          console.log("User Successfully Logged In!");
          // sessionStorage.setItem('userID', userExists._id);
          req.session.user = userExists;
          currentUser = userExists;
          res.redirect("/landing");
        } else {
          console.log("Incorrect Password!");
          res.status(500).send("Incorrect Password")
        }
      } else {
        console.log("User not found!");
        res.status(500).send('Email does not exist')
      }
    }
  }
  );
});

// GET Route for currentUser
app.get("/currentUser", function (req, res) {
  res.send(currentUser);
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

// edit password from user dashboard page
app.post("/change-password", function (req, res) {
  User.findOne({ password: md5(req.body.currentPassword) }, function (err, user) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (!user) {
      console.log("Current password does not match");
      res.status(400).send("Current password does not match");
    } else {
      User.findOneAndUpdate({ _id: req.body.userId }, { password: md5(req.body.newPassword) }, function (err) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.status(201).send("success")
        }
      });
    }
  });
});

app.get("/logout", async function(req, res) {
  req.session.user = null;
  currentUser = null
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

/* ---------- [End] Login/Register/Home/Forgot Password Routes ---------- */

/* ---------- [Start] Helper Functions ---------- */

function roundToNearestHalf(num) {
  // Check if the number is within the desired range
  if (num < 0 || num > 5) {
    throw new Error('Number is not within the range of 0 and 5');
  }
  
  // Round to the nearest 0.5
  const roundedNum = Math.round(num * 2) / 2;
  
  // Ensure the rounded number is within the range of 0 and 5
  return Math.max(0, Math.min(5, roundedNum));
}

/* ---------- [End] Helper Functions ---------- */

// contact page submission
app.post("/submit-request", function (req, res) {
  console.log("getting here")
  const msg = {
    from: '"Team AllPurdue" allpurdue2023@gmail.com',
    to: '"Team AllPurdue" allpurdue2023@gmail.com',
    subject: req.body.requestType + ' request from ' + req.body.email,
    text: req.body.requestType === 'Add Place' ? req.body.name + '\n' + req.body.message : 'Report Issue' + '\n' + req.body.message
  }
  transporter.sendMail(msg, function(err){
    if (err) {
      console.log(err);
      res.status(500).send("error submitting request")
    } else {
      console.log("successful request submission");
      res.status(200).send("success")
    }
  });
});
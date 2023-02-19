// import mongoose from "mongoose";
// const Schema = mongoose.Schema;

const mongoose = require("mongoose");

// Mongoose Schema Docs - https://mongoosejs.com/docs/guide.html
// Good Schema Format Example here - https://stackoverflow.com/questions/35509611/mongoose-save-array-of-strings 

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
  
  const Place = mongoose.model("Place", placeSchema);
  
  export default place;
 // module.exports = place; // alt method
  
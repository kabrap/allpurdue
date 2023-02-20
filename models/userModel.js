// import mongoose from "mongoose";
// const Schema = mongoose.Schema;

const mongoose = require("mongoose");

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
    },
    { timestamps: true }
  );
  
  const User = new mongoose.model("User", userSchema);
  
  // export default User; // alt method
  module.exports = User; 
  
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
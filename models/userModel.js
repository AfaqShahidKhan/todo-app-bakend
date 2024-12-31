const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const AppError = require("./../utils/appError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
    minLength: [3, "Name should be of 3 characters or more"],
    maxLength: [20, "Name should have maximum 20 characters"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please write correct email"],
  },
  password: {
    type: String,
    minLength: [4, "Password should have minimum 4 characters"],
    required: [true, "Password is required"],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm the password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
  return isCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

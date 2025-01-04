const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  const token = await signInToken(user._id);
  // console.log(`Ttoken is ${token}`);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Email or password are incorrect", 401));
  }

  const token = signInToken(user._id);
  // console.log(`user token is----- ${token}`);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.protected = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log(`token value is ${token}`);
  }

  if (!token) {
    return next(
      new AppError("You are not logged in please log in again.", 400)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(`decoded token is ---- ${JSON.stringify(decoded)}`);

  const freshUser = await User.findById(decoded._id);

  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User PAssword is recently changed please login again.", 401)
    );
  }

  req.user = freshUser;

  next();
});

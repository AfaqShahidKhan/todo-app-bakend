const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");

exports.getAllUsers = factory.getAll(User);

exports.getUser = catchAsync(async (req, res, next) => {
  const user = req.user;

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  res.status(200).json({
    status: "success",
    data:  {
        data: userData,
      },
  });
});

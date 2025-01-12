const User = require("../models/userModel");
const factory = require("./handleFactory");

exports.getAllUsers = factory.getAll(User);

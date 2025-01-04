const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.get("/login", authController.login);

router.get("/", authController.protected, userController.getAllUsers);

module.exports = router;

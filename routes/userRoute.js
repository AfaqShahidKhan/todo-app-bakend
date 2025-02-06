const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const taskRouter = require("./taskRoute");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.protected,
  authController.updatePassword
);

router.get(
  "/",
  authController.protected,
  authController.restrictTo("admin"),
  userController.getAllUsers
);

router.use(authController.protected);

router.get("/me", userController.getMe, userController.getUser);

router.patch(
  "/updateMe",
  userController.updateUserPhoto,
  userController.updateMe
);

router.use("/:userId/tasks", taskRouter);
module.exports = router;

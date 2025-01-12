const express = require("express");

const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protected);
router.get("/overdue", taskController.getAllOverDueTasks);

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);
router
  .route("/:id")
  .get(taskController.getTask)
  .put(authController.restrictTo("admin"), taskController.updateTask)
  .delete(authController.restrictTo("admin"), taskController.deleteTask);

module.exports = router;

const express = require("express");

const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protected);
router.get("/overdue", taskController.getAllOverDueTasks);

router.get("/assignToMe", taskController.getAssignToMe);

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);
router
  .route("/:id")
  .get(taskController.getTask)
  .patch(authController.restrictTo("user", "admin"), taskController.updateTask)
  .delete(authController.restrictTo("admin"), taskController.deleteTask);

module.exports = router;

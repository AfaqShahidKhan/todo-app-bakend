const express = require("express");

const taskController = require("../controllers/taskController");
const router = express.Router({ mergeParams: true });

router.get('/overdue',taskController.getAllOverDueTasks)

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);
router
  .route("/:id")
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;

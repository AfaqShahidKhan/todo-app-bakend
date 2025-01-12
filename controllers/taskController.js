const Task = require("../models/taskModel");
const factory = require("./handleFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllTasks = factory.getAll(Task);

exports.getAllOverDueTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find();
  // console.log(`total tasks are ${tasks}`);

  const overDueTasks = tasks.filter(
    (task) => task.overDue || new Date(task.dueDate) < new Date()
  );

  // console.log(`overdue tasks are ${overDueTasks}`);

  res.status(200).json({
    status: "success",
    results: overDueTasks.length,
    data: {
      tasks: overDueTasks,
    },
  });
});

exports.getTask = factory.getOne(Task);

exports.createTask = factory.createOne(Task);

exports.updateTask = factory.updateOne(Task);

exports.deleteTask = factory.deleteOne(Task);

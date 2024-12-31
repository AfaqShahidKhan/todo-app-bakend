const Task = require("../models/taskModel");

const catchAsync = require("../utils/catchAsync");

exports.getAllTasks = catchAsync(async (req, res) => {
  const tasks = await Task.filterTasks(req.query);
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

exports.getAllOverDueTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find();
  // console.log(`total tasks are ${tasks}`);

  const overDueTasks = tasks.filter((el) => el.overDue);

  // console.log(`overdue tasks are ${overDueTasks}`);

  res.status(200).json({
    status: "success",
    results: overDueTasks.length,
    data: {
      tasks: overDueTasks,
    },
  });
});

exports.getTask = catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.id);
  console.log(`Task is ${task}`);

  if (!task) {
    return res.status(404).json({
      status: "failed",
      message: "No task found with that ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.createTask = catchAsync(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.updateTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return res.status(404).json({
      status: "failed",
      message: "No task found with that ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({
      status: "failed",
      message: "No task found with that ID",
    });
  }
  console.log(`Deleted task is ${task}`);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

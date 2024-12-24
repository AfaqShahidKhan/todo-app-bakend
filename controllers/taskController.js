const Task = require("../models/taskModel");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.filterTasks(req.query);    
    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

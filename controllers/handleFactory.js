const schedule = require("node-schedule");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/email");

const frequencyMap = {
  daily: "0 9 * * *", // Every day at 9:00 AM
  weekly: "0 9 * * 1", // Every Monday at 9:00 AM
  biweekly: "0 9 */14 * *", // Every 14 days at 9:00 AM
  monthly: "0 9 1 * *", // On the 1st of every month at 9:00 AM
};
const scheduleTask = async (Model, task) => {
  const cronExpression = frequencyMap[task.recurring];
  console.log("i am upper most", task);
  const populatedTask = await Model.findOne(task).populate("user");
  const user = populatedTask.user;

  if (cronExpression) {
    schedule.scheduleJob(cronExpression, async () => {
      try {
        const { _id, recurring, ...newTask } = task;

        const doc = await Model.create(newTask);
        const sendUserEmail = new Email(user, null);
        sendUserEmail.sendRecurringNotification();
        console.log(`Recurring task created:`, doc);
      } catch (error) {
        console.error("Error creating recurring task:", error);
      }
    });
  } else {
    console.error("Invalid frequency:", task.recurring);
  }
};

const scheduleReminderNotification = async (Model, task) => {
  if (!task.reminder) return;

  const user = await Model.findById(task._id).populate("user");
  if (!user) return console.error("User not found for reminder notification.");

  const reminderTime = new Date(task.reminder);

  if (reminderTime < new Date()) {
    console.error("Reminder time is in the past. Ignoring.");
    return;
  }
  await Model.findByIdAndUpdate(task._id, { $set: { scheduled: true } });

  schedule.scheduleJob(task._id.toString(), reminderTime, async () => {
    try {
      const sendUserEmail = new Email(user.user, null);
      sendUserEmail.sendReminderNotification(task);
      console.log(`Reminder sent for task:`, task.name);
      await Model.findByIdAndUpdate(task._id, { $set: { scheduled: false } });

    } catch (error) {
      console.error("Error sending reminder notification:", error);
    }
  });
};

exports.rescheduleJobsOnRestart = async (Model) => {
  const tasks = await Model.find({ scheduled: true });

  tasks.forEach((task) => {
    scheduleReminderNotification(Model, task);
  });

  console.log(`Rescheduled ${tasks.length} reminder jobs.`);
};


exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const currentUser = req.user;
    const filter =
      currentUser.role === "admin" ? {} : { user: req.params.userId };
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    // console.log(`Filtered docs: ${JSON.stringify(docs)}`);

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    let doc = await Model.create(req.body);

    if (req.body.recurring && req.body.recurring !== "none") {
      await scheduleTask(Model, req.body);
    }

    if (req.body.reminder) {
     await scheduleReminderNotification(Model, doc);
    }

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    console.log(`Doc is ${doc}`);

    if (!doc) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const userName = req.user ? req.user.name : "Unknown";
    if (Model.modelName === "Task") {
      if (!req.body.updatedBy) {
        req.body.updatedBy = userName;
      }
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }
    if (req.body.reminder) {
      scheduleReminderNotification(Model, doc);
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        status: "failed",
        message: "No doc found with that ID",
      });
    }
    console.log(`Deleted document is ${doc}`);

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

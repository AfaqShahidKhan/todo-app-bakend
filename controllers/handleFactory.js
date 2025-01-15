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

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const filter = req.params.userId ? { user: req.params.userId } : {};
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
    let doc;

    if (req.body.recurring && req.body.recurring !== "none") {
      doc = await Model.create(req.body);

      await scheduleTask(Model, req.body);
    } else {
      doc = await Model.create(req.body);
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

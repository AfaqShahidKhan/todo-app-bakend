const mongoose = require("mongoose");
const ApiFeatures = require("../utils/apiFeatures");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    overDue: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

taskSchema.pre("save", function (next) {
  if (this.dueDate < Date.now()) {
    this.overDue = true;
  }
  next();
});

// taskSchema.index({ title: 1 }, { unique: true });

const Task = mongoose.model("Task", taskSchema);

Task.filterTasks = async (queryParams) => {
  const features = new ApiFeatures(Task.find(), queryParams)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tasks = await features.query;
  return tasks;
};



module.exports = Task;

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
    recurring: {
      type: String,
      enum: ["none", "daily", "weekly", "biweekly", "monthly"],
      default: "none",
    },
    dueDate: {
      type: Date,
    },
    overDue: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

taskSchema.pre("save", function (next) {
  if (this.dueDate && this.dueDate < Date.now()) {
    this.overDue = true;
  }
  next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "-__v -password",
  });
  next();
});

// taskSchema.index({ title: 1 }, { unique: true });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

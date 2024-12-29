const express = require("express");
const taskRoute = require("./routes/taskRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/tasks", taskRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;

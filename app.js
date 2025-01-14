const express = require("express");
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const taskRoute = require("./routes/taskRoute");
const userRoute = require("./routes/userRoute");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();
// set Security HTTP headers
app.use(helmet());

// Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this device, please try again after an Hour",
});
app.use("/api", limiter);

// Data Sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitize against XSS
app.use(xss());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;

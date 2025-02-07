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
const path = require('path');

const app = express();

// CORS setup
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow requests from the frontend on port 3000
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
};

app.use(cors(corsOptions));  // Apply CORS middleware globally

// Other middleware
app.use(helmet());  // Set security HTTP headers
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use('/images/users', express.static(path.join(__dirname, 'public/images/users')));

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,  // 1 hour
  message: "Too many requests, please try again after an hour",
});
app.use("/api", limiter);

// Data sanitization against NoSQL query injections and XSS
app.use(mongoSanitize());
app.use(xss());

// Routes
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/users", userRoute);

// Catch-all route for non-existent endpoints
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;

const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");
console.log("curruntly running in--", process.env.NODE_ENV);
// value of node env is not showing

console.log("Connecting to:", process.env.DATABASE_LOCAL);

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log("App is running on port", port)
);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

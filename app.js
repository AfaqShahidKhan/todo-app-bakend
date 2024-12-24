const express = require("express");
const taskRoute = require('./routes/taskRoute');
const app = express();




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/tasks", taskRoute);










module.exports = app;

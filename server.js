const mongoose = require("mongoose");
const app = require("./app");
const PORT = 3000;

mongoose.connect(
  "mongodb://localhost:27017/todo-app",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    console.log(err ? err : "Connected to database");
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

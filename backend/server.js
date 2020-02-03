const express = require("express");
const connectDb = require("./config/db");

const app = express();

app.get("/", (req, res, next) => {
  res.send("200K, Server up and running!");
});

const PORT = process.env.PORT || 5000;

// define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// connect database
connectDb()
  .then(() => {
    // listen after mongoDb connected
    app.listen(PORT, () => {
      console.log(`Server started on port : ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

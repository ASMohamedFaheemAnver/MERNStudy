const express = require("express");

const app = express();

app.get("/", (req, res, next) => {
    res.send("20K, SERVER IS UP AND RUNNING!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER STARTED ON PORT : ${PORT}`);
});
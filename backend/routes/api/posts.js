const express = require("express");

const router = express.Router();

// @route GET api/posts
// @desc test route
// @acces public
router.get("/", (req, res, next) => {});

module.exports = router;

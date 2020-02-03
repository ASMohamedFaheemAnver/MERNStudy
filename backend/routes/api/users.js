const express = require("express");

const router = express.Router();

// @route GET api/users
// @desc test route
// @acces public
router.get("/", (req, res, next) => {});

module.exports = router;

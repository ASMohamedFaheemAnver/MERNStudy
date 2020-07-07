const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route GET api/auth
// @desc test route
// @acces public
router.get("/", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;

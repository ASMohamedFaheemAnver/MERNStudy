const express = require("express");

const router = express.Router();

const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const User = require("../../models/User");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");

// @route GET api/auth
// @desc get user route
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

// @route POST api/auth
// @desc Authenticate user
// @acces public
router.post(
  "/",
  [
    check("email", "Please include a valid email.").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters."
    ).isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Se if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(403)
          .json({ errors: [{ msg: "User doesn't exist." }] });
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json({ errors: [{ msg: "Invalid password." }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = await jwt.sign(payload, config.get("jwtSecret"), {
        expiresIn: 360000,
      });

      // if (err) {
      //   res.status(500).json({ errors: [{ msg: "Internal server error." }] });
      //   return console.log(err);
      // }
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = router;

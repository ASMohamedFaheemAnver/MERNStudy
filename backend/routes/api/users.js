const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");

// @route POST api/users
// @desc Register user
// @acces public
router.post(
  "/",
  [
    check("name", "Name is required.").not().isEmpty(),
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

    const { name, email, password } = req.body;
    try {
      // Se if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(403)
          .json({ errors: [{ msg: "User already exists." }] });
      }

      // Get users gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({ name, email, avatar });

      // Encrypt password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      await user.save();

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

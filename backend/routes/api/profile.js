const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const { check, validationResult } = require("express-validator");

const request = require("request");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route GET api/profile
// @desc Create or update profile
// @acces private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required.").not().isEmpty(),
      check("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      github_user_name,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    console.log(req.body);

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    /*if (bio)*/ profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (github_user_name) profileFields.github_user_name = github_user_name;
    if (skills && !Array.isArray(skills))
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  }
);

// @route GET api/profile/me
// @desc Get current users profile
// @acces private
router.get("/me", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

// @route GET api/profile
// @desc Get all profiles
// @acces public

router.get("/", async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user id
// @acces public

router.get("/user/:user_id", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err);
    if (err.kind == "ObjectId") {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }
    res.status(500).send("Internal server error.");
  }
});

// @route DELETE api/profile
// @desc Delete profile, user & posts
// @acces Private

router.delete("/", auth, async (req, res, next) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted." });
  } catch (err) {
    console.log(err);
  }
});

// @route PUT api/profile/experience
// @desc Add profile experience
// @acces Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required.").not().isEmpty(),
      check("company", "Company is required.").not().isEmpty(),
      check("from", "From date is required.").not().isEmpty(),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete profile experience
// @acces Private

router.delete("/experience/:exp_id", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience = profile.experience.filter(
      (exp) => exp._id != req.params.exp_id
    );

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

// @route PUT api/profile/education
// @desc Add profile education
// @acces Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required.").not().isEmpty(),
      check("degree", "Degree is required.").not().isEmpty(),
      check("field_of_study", "Field of study is required.").not().isEmpty(),
      check("from", "From date is required.").not().isEmpty(),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      field_of_study,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      field_of_study,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  }
);

// @route DELETE api/profile/education/:edu_id
// @desc Delete profile education
// @acces Private

router.delete("/education/:edu_id", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education = profile.education.filter(
      (edu) => edu._id != req.params.edu_id
    );

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

// @route DELETE api/profile/github/:user_name
// @desc Get user repos from github
// @acces Public

router.get("/github/:user_name", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.user_name
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          "githubClientId"
        )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github profile found." });
      }
      return res.json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;

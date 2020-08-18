const express = require("express");

const router = express.Router();

const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route POST api/posts
// @desc Create post
// @acces Private
router.post(
  "/",
  [auth, [check("text", "Text is requied.").not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  }
);

// @route GET api/posts
// @desc Get all posts
// @acces Private

router.get("/", auth, async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    console.log(posts);
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

// @route GET api/posts/:id
// @desc Get post by id
// @acces Private

router.get("/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }
    console.log(post);
    res.json(post);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found." });
    }
    res.status(500).send("Internal server error.");
  }
});
// @route DELETE api/posts/:id
// @desc Delete post by id
// @acces Private

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }

    await post.remove();

    res.json({ msg: "Post deleted." });
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found." });
    }
    res.status(500).send("Internal server error.");
  }
});

// @route PUT api/posts/like/:id
// @desc Like a post
// @acces Private

router.put("/like/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status("400").json({ msg: "Post already liked." });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found." });
    }
    res.status(500).send("Internal server error.");
  }
});

// @route PUT api/posts/unlike/:id
// @desc Unlike a post
// @acces Private

router.put("/unlike/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status("400").json({ msg: "Post has not yet been liked." });
    }
    post.likes = post.likes.filter((like) => {
      like.id !== req.user.id;
    });
    await post.save();
    return res.json(post.likes);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found." });
    }
    res.status(500).send("Internal server error.");
  }
});

// @route POST api/posts/commants/:id
// @desc Commant on a post
// @acces Private
router.post(
  "/commants/:id",
  [auth, [check("text", "Text is requied.").not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(400).send("No post found.");
      }

      const newcommant = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.commants.unshift(newcommant);
      await post.save();

      return res.json(post.commants);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  }
);

// @route DELETE api/posts/commants/:id/:commant_id
// @desc Delete commant
// @acces Private

router.delete("/commants/:id/:commant_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out commant
    const commant = post.commants.find(
      (commant) => commant.id === req.params.commant_id
    );

    // Make sure commant exists
    if (!commant) {
      return res.status(404).json({ msg: "Commant does not exist." });
    }

    // Check user
    if (commant.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }

    post.commants = post.commants.filter((commant) => {
      return commant.id.toString() !== req.params.commant_id.toString();
    });

    await post.save();
    res.json(post.commants);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;

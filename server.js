// server.js
const express = require("express");
const connectDatabase = require("./config/db");
const { check, validationResult } = require("express-validator");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const auth = require("./middleware/auth");
const cors = require("cors");

dotenv.config();

const app = express();

/* ============================================================
   SAFARI / AXIOS CORS FIX — DO NOT CHANGE ANYTHING HERE
============================================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    exposedHeaders: ["x-auth-token"],
    credentials: true,
  })
);

app.use(express.json({ extended: false }));

// Connect to MongoDB
connectDatabase();

// ================================
// ROOT ROUTE
// ================================
app.get("/", (req, res) => res.send("API Running"));

/* ================================
   REGISTER USER
================================ */
app.post(
  "/api/users",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Valid email required").isEmail(),
    check("password", "Min 6 chars").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User exists" });

      const hash = await bcrypt.hash(password, 10);

      user = new User({ name, email, password: hash });
      await user.save();

      const payload = { user: { id: user._id } };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

/* ================================
   LOGIN USER
================================ */
app.post(
  "/api/auth",
  [
    check("email", "Valid email required").isEmail(),
    check("password", "Password required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

      const payload = { user: { id: user._id } };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;

        res.json({
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

/* ================================
   GET ALL POSTS
================================ */
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/* ================================
   GET SINGLE POST
================================ */
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name");
    if (!post) return res.status(404).json({ msg: "Not found" });

    res.json(post);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/* ================================
   CREATE POST
================================ */
app.post(
  "/api/posts",
  [auth, check("title").notEmpty(), check("body").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const post = new Post({
        user: req.user.id,
        title: req.body.title,
        body: req.body.body,
      });

      await post.save();
      await post.populate("user", "name");

      res.json(post);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

/* ================================
   UPDATE POST
================================ */
app.put(
  "/api/posts/:id",
  [auth, check("title").notEmpty(), check("body").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: "Not found" });

      if (post.user.toString() !== req.user.id)
        return res.status(401).json({ msg: "Unauthorized" });

      post.title = req.body.title;
      post.body = req.body.body;

      await post.save();
      await post.populate("user", "name");

      res.json(post);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

/* ================================
   DELETE POST
================================ */
app.delete("/api/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });

    await post.deleteOne();
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/* ================================
   COMMENTS ROUTES
================================ */

// GET comments for a post
app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ADD comment
app.post(
  "/api/posts/:postId/comments",
  [auth, check("text", "Comment text required").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ msg: "Post not found" });

      let comment = new Comment({
        post: req.params.postId,
        user: req.user.id,
        text: req.body.text,
      });

      await comment.save();
      await comment.populate("user", "name");

      res.json(comment);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// DELETE comment
app.delete("/api/comments/:id", auth, async (req, res) => {
  try {
    const c = await Comment.findById(req.params.id);
    if (!c) return res.status(404).json({ msg: "Not found" });

    if (c.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });

    await c.deleteOne();

    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// LIKE comment
app.post("/api/comments/:id/like", auth, async (req, res) => {
  try {
    const c = await Comment.findById(req.params.id);
    if (!c) return res.status(404).json({ msg: "Not found" });

    const uid = req.user.id;

    if (c.likes.includes(uid)) {
      c.likes = c.likes.filter((id) => id.toString() !== uid);
    } else {
      c.likes.push(uid);
    }

    await c.save();
    res.json({ id: c._id, likes: c.likes });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

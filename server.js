const express = require("express");
const connectDatabase = require("./config/db");
const { check, validationResult } = require("express-validator");
const User = require("./models/User");
const Post = require("./models/Post"); // ✅ Post model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const auth = require("./middleware/auth"); // ✅ Auth middleware
const cors = require("cors"); // ✅ Added CORS

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize express FIRST
const app = express();

// ✅ Enable CORS after creating app
app.use(cors());

// ✅ Middleware to parse JSON
app.use(express.json({ extended: false }));

// ✅ Connect Database
connectDatabase();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

/**
 * ========================
 * AUTH ROUTES (Register/Login)
 * ========================
 */

// @route   POST api/users
// @desc    Register user
app.post(
  "/api/users",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6+ characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth
// @desc    Authenticate user & get token
app.post(
  "/api/auth",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = { user: { id: user.id } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * ========================
 * POST ROUTES (CRUD)
 * ========================
 */

// @route   GET api/posts
// @desc    Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/posts/:id
// @desc    Get single post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name");

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   POST api/posts
// @desc    Create a post
app.post(
  "/api/posts",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("body", "Body is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, body } = req.body;

      const newPost = new Post({
        user: req.user.id,
        title,
        body,
      });

      const post = await newPost.save();
      await post.populate("user", "name");

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   PUT api/posts/:id
// @desc    Update a post
app.put(
  "/api/posts/:id",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("body", "Body is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, body } = req.body;
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      post.title = title;
      post.body = body;

      await post.save();
      await post.populate("user", "name");

      res.json(post);
    } catch (error) {
      console.error(error.message);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete a post
app.delete("/api/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

/**
 * ========================
 * START SERVER
 * ========================
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

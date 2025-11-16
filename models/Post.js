// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // ⭐ Auto-created createdAt + updatedAt
);

module.exports = mongoose.model("Post", PostSchema);

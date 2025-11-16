// client/src/components/CommentSection.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  getComments,
  addComment,
  deleteComment,
  toggleLike,
} from "../services/api";

import "./CommentSection.css";

const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // Load comments
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      toast.error("Failed to load comments.");
    }
  };

  // Submit new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const newComment = await addComment(postId, text);
      setComments([newComment, ...comments]);
      setText("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment.");
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted.");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  // Like / Unlike
  const handleLike = async (commentId) => {
    try {
      const updated = await toggleLike(commentId);

      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, likes: updated.likes } : c
        )
      );
    } catch (err) {
      toast.error("Failed to like comment.");
    }
  };

  return (
    <div className="comment-section">

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
        ></textarea>

        <button type="submit" className="comment-btn">
          Post Comment
        </button>
      </form>

      <div className="comment-list">
        {comments.length === 0 && <p>No comments yet. Be the first!</p>}

        {comments.map((comment) => {
          const isOwner = currentUser?._id === comment.user?._id;
          const liked = comment.likes?.includes(currentUser?._id);

          return (
            <div key={comment._id} className="comment-card">
              <div className="comment-header">
                <strong>{comment.user?.name}</strong>
                {isOwner && (
                  <button
                    className="delete-comment"
                    onClick={() => handleDelete(comment._id)}
                  >
                    ✖
                  </button>
                )}
              </div>

              <p className="comment-text">{comment.text}</p>

              <button
                className={`like-btn ${liked ? "liked" : ""}`}
                onClick={() => handleLike(comment._id)}
              >
                ❤️ {comment.likes?.length || 0}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;

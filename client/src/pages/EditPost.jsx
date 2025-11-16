// client/src/pages/EditPost.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getPostById, updatePost } from "../services/api";

import "./EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);

        if (!data) {
          toast.error("Post not found.");
          return navigate("/");
        }

        // Fill form with existing post values
        setTitle(data.title || "");
        setBody(data.body || "");

        // 🚨 FIXED — correct ID check
        if (data.user?._id !== user?._id) {
          toast.error("You are not allowed to edit this post.");
          return navigate("/");
        }
      } catch (err) {
        console.error("Error loading post:", err);
        toast.error("Failed to load the post.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePost(id, { title, body });
      toast.success("Post updated successfully!");
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post.");
    }
  };

  if (loading) {
    return (
      <div className="edit-wrapper">
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="edit-wrapper">
      <div className="edit-card">

        <h1>Edit Post</h1>

        <form onSubmit={handleSubmit} className="edit-form">

          {/* Title */}
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Body */}
          <label>Body</label>
          <textarea
            rows="6"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>

          {/* Submit */}
          <button type="submit" className="save-btn">
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditPost;

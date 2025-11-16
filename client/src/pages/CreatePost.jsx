import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { createPost } from "../services/api";
import toast from "react-hot-toast";
import "./CreatePost.css";

const CreatePost = () => {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createPost({ title, body });
      toast.success("Post created successfully!");

      setTitle("");
      setBody("");
    } catch (err) {
      toast.error("Failed to create post.");
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">

        <h1>Create a New Post</h1>

        <form className="create-post-form" onSubmit={handleSubmit}>
          
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter your title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Content</label>
          <textarea
            placeholder="Write your post..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>

          <button type="submit" className="submit-btn">
            Create Post
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreatePost;

// client/src/pages/PostDetail.jsx
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, deletePost } from "../services/api";
import { formatDistanceToNow, format } from "date-fns";
import CommentSection from "../components/CommentSection"; // ⭐ REQUIRED

import "./PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      toast.success("Post deleted!");
      navigate("/");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="post-detail">Loading…</div>;
  if (!post) return <div className="post-detail">Post not found</div>;

  const isOwner = user?._id === post.user?._id;

  return (
    <div className="post-detail">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Title */}
      <h1>{post.title}</h1>

      {/* Meta */}
      <div className="post-detail-meta">
        <span>
          ⏱{" "}
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          })}
        </span>
        <span>📅 {format(new Date(post.createdAt), "MMMM do, yyyy")}</span>
        <span>✍️ {post.user?.name}</span>
      </div>

      {/* Body */}
      <p className="post-detail-body">{post.body}</p>

      {/* Edit/Delete Buttons */}
      {isOwner && (
        <div className="post-actions">
          <Link to={`/posts/${id}/edit`}>
            <button className="edit-button">Edit</button>
          </Link>

          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      {/* ⭐ COMMENT SECTION ⭐ */}
      <CommentSection postId={id} currentUser={user} />
    </div>
  );
};

export default PostDetail;

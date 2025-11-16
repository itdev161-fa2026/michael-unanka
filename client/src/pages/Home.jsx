import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/api"; 
import { AuthContext } from "../context/authContext";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);  
  const [filteredPosts, setFilteredPosts] = useState([]);   // ⭐ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState(""); // ⭐ Search text

  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const data = await getPosts();   // backend returns ARRAY

      if (Array.isArray(data)) {
        setPosts(data);
        setFilteredPosts(data);        // ⭐ show all posts at first
      } else {
        console.warn("Unexpected response:", data);
        setPosts([]);
        setFilteredPosts([]);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load posts.");
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ FILTER POSTS LOCALLY (NO BACKEND SEARCH NEEDED)
  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(q.toLowerCase()) ||
      post.body.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [q, posts]);

  if (loading) return <div className="container loading">Loading posts...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="container">

      <div className="home-header">
        <h1>Recent Posts</h1>

        {user ? (
          <p className="auth-message">Welcome back! You can browse posts below.</p>
        ) : (
          <p className="auth-message">
            <a href="/login">Login</a> or <a href="/register">register</a> to create posts.
          </p>
        )}

        {/* ⭐ SEARCH + CREATE POST BUTTON */}
        <div className="search-create-row">
          <input
            type="text"
            placeholder="Search posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="search-input"
          />

          {user && (
            <Link to="/create-post" className="create-post-btn">
              + Create Post
            </Link>
          )}
        </div>
      </div>

      {/* POST LIST */}
      {filteredPosts.length === 0 ? (
        <div className="no-posts">
          <p>No posts found{q ? ` for "${q}"` : ""}.</p>
        </div>
      ) : (
        <div className="posts-list">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

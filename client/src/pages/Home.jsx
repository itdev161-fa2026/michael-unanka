import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getPosts } from '../services/api';
import { AuthContext } from '../context/authContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts. Make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Show loading message
  if (loading) {
    return <div className="container loading">Loading posts...</div>;
  }

  // Show error message
  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="home-header">
        <h1>Recent Posts</h1>

        {/* Show Create button only for logged-in users */}
        {user ? (
          <button
            onClick={() => navigate('/posts/create')}
            className="create-post-button"
          >
            Create New Post
          </button>
        ) : (
          <p className="auth-message">
            <a href="/login">Login</a> or <a href="/register">register</a> to create posts.
          </p>
        )}
      </div>

      {/* Display posts */}
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet. Check back later!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { createPost } from '../services/api';
import PostForm from '../components/PostForm';
import './CreatePost.css';

const CreatePost = () => {
  const { user } = useContext(AuthContext);       // current logged-in user
  const navigate = useNavigate();                 // lets us change pages
  const [loading, setLoading] = useState(false);  // shows “Creating…” while saving
  const [error, setError] = useState(null);       // holds any error message

  // runs when form is submitted
  const handleSubmit = async (title, body) => {
    try {
      setError(null);
      setLoading(true);

      const newPost = await createPost(title, body); // call backend API

      // after successful creation, go to that post’s detail page
      navigate(`/posts/${newPost._id}`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.msg ||
        'Failed to create post. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  // if Cancel clicked → go back home
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="create-post-page">
      <div className="container">
        {error && (
          <div className="error-message">{error}</div>
        )}
        <PostForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreatePost;

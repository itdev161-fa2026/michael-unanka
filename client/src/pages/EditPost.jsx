import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { getPostById, updatePost } from '../services/api';
import PostForm from '../components/PostForm';
import './EditPost.css';

const EditPost = () => {
  // get post id from URL like /posts/123/edit
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // local state
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // load post data when page opens
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);

        // verify the logged-in user owns this post
        if (user && data.user._id !== user.id) {
          setError("You don't have permission to edit this post.");
          setLoading(false);
          return;
        }

        setPost(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError('Failed to load post. It may not exist or the server is down.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  // when Save Changes clicked
  const handleSubmit = async (title, body) => {
    try {
      setError(null);
      setSubmitting(true);
      await updatePost(id, title, body); // call backend to save
      navigate(`/posts/${id}`);          // go back to detail page
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.msg ||
        'Failed to update post. Please try again.';
      setError(errorMsg);
      setSubmitting(false);
    }
  };

  // when Cancel clicked
  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };

  // show loading spinner
  if (loading) {
    return <div className="container loading">Loading post...</div>;
  }

  // show error if not owner or fetch failed
  if (error && !post) {
    return (
      <div className="container error">
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
      </div>
    );
  }

  // main page
  return (
    <div className="edit-post-page">
      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <PostForm
          mode="edit"
          initialData={post}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default EditPost;

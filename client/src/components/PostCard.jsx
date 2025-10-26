import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const created = post.createdAt || post.createDate; // handles common schema names

  return (
    <div className="post-card">
      <Link to={`/posts/${post._id}`} className="post-card-link">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span className="post-author">By {post.user?.name || 'Unknown'}</span>
          <span className="post-date">{formatDate(created)}</span>
        </div>
        <p className="post-preview">
          {post.body?.substring(0, 150)}
          {post.body && post.body.length > 150 ? '…' : ''}
        </p>
        {/* Tip: to insert the arrow after "Read more", you can
            a.) use unicode: {'\u2192'}
            b.) Win: Windows + . (emoji picker) and search "arrow"
            c.) Mac: Ctrl + Cmd + Space and search "arrow" */}
        <span className="read-more">Read more →</span>
      </Link>
    </div>
  );
};

export default PostCard;

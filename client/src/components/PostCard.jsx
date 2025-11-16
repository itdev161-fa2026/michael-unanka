import { Link } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import "./PostCard.css";

const PostCard = ({ post }) => {
  // ⭐ TIME AGO FORMAT (e.g., "26 minutes ago")
  let dateText = "Unknown date";
  let fullDate = "";

  if (post?.createdAt) {
    const dateObj = new Date(post.createdAt);

    if (!isNaN(dateObj.getTime())) {
      dateText = formatDistanceToNow(dateObj, { addSuffix: true });
      fullDate = format(dateObj, "PPP"); // "Nov 13, 2025"
    }
  }

  return (
    <div className="post-card">
      <h2 className="post-title">
        <Link to={`/posts/${post._id}`}>{post.title}</Link>
      </h2>

      <p className="post-body">
        {post.body.length > 120
          ? post.body.substring(0, 120) + "..."
          : post.body}
      </p>

      {/* ⭐ DISPLAY BOTH TIME AGO + FULL DATE */}
      <p className="post-date">
        Posted {dateText}
        <br />
        <span style={{ color: "#666", fontSize: "14px" }}>
          ({fullDate})
        </span>
      </p>

      <Link to={`/posts/${post._id}`} className="read-more">
        Read More →
      </Link>
    </div>
  );
};

export default PostCard;

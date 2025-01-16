import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Send as SendIcon, ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
import '../css/RequestDetail.css';

function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch current user first
        const userResponse = await fetch('https://loopplus.mydns.jp/whoami', { credentials: 'include' });
        if (!userResponse.ok) throw new Error('Failed to fetch current user');
        const userData = await userResponse.json();
        setCurrentUser(userData); // Store current user's UserID

        // Fetch request data
        if (location.state) {
          const { id, userId, name, time, content, imageSrc, userIcon } = location.state;
          setRequest({
            id, UserID: userId, UserName: name, CreatedAt: time, RequestContent: content, RequestImage: imageSrc, UserIcon: userIcon
          });
        }
        else {
          const requestResponse = await fetch(`https://loopplus.mydns.jp/request/${id}`);
          if (!requestResponse.ok) throw new Error('ログインセッションが切れています。ログインし直してください。');
          const requestData = await requestResponse.json();
          setRequest(requestData);
        }

        // Fetch comments
        const commentsResponse = await fetch(`https://loopplus.mydns.jp/request/${id}/comment`);
        if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
        const commentsData = await commentsResponse.json();

        // Fetch user info for each comment
        const updatedComments = await Promise.all(
          commentsData.map(async (comment) => {
            const userResponse = await fetch(`https://loopplus.mydns.jp/user/${comment.UserID}`);
            if (!userResponse.ok) throw new Error('Failed to fetch user info');
            const userData = await userResponse.json();
            return {
              ...comment,
              UserName: userData.Username,
              UserIcon: userData.Icon,
            };
          })
        );

        setComments(updatedComments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.state]);


  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/request/${id}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newComment }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to send comment: ${errorData.message || 'Unknown error'}`);
        }

        const createdComment = await response.json();

        // Include all necessary fields in the new comment
        const newCommentData = {
          ReplyID: createdComment.ReplyID || new Date().getTime(), // Unique ID for React rendering
          UserID: currentUser.UserID, // Ensure the current user's ID is included
          UserName: currentUser.Username, // Current user's name
          UserIcon: currentUser.Icon, // Current user's icon
          ReplyContent: newComment, // The text of the comment
          CreatedAt: new Date().toISOString(), // Set the current timestamp
        };

        setComments((prevComments) => [...prevComments, newCommentData]); // Append to comments
        setNewComment(''); // Clear the input field
      } catch (err) {
        console.error('Error submitting comment:', err.message);
      }
    }
  };


  const getIconSrc = (iconPath) => {
    return iconPath && iconPath.startsWith('storage/images/')
      ? `https://loopplus.mydns.jp/${iconPath}`
      : iconPath;
  };

  if (loading) return <div className="loading"><img src="/Loading.gif" alt="Loading" /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="request-detail-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">リクエスト</h1>
      </div>

      {request && (
        <div className="request-item">
          <Link to={`/profile/${request?.UserID}`} className="link">
            <div className="profile">
              {request?.UserIcon ? (
                <img
                  src={getIconSrc(request.UserIcon)}
                  alt="User Icon"
                  className="avatar-icon"
                  style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                />
              ) : (
                <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
              )}
              <div className="profile-info">
                <span className="name">{request?.UserName || '不明'}</span>
                <span className="time">
                  {request?.CreatedAt &&
                    new Date(request.CreatedAt).toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                </span>
              </div>
            </div>
          </Link>

          <div className="content">
            <p>{request.RequestContent}</p>
            {request.RequestImage && (
              <img
                src={request.RequestImage}
                alt="Request"
                className="request-images"
              />
            )}
          </div>
          <div className="interaction-bar">
            <span className="comment-count">コメント {comments.length}</span>
          </div>
        </div>
      )}

      <div className="comments-section">
        {comments.map((comment, index) => (
          <React.Fragment key={comment.ReplyID || comment.CreatedAt}>
            {/* Add a divider above the first comment */}
            {index === 0 && <div className="comment-divider"></div>}

            <div
              className={`comment ${currentUser && currentUser.UserID === comment.UserID ? 'user-comment' : 'other-comment'}`}
            >
              <div className="comment-header-wrapper">
                {comment.UserIcon ? (
                  <img
                    src={getIconSrc(comment.UserIcon)}
                    alt="User Icon"
                    className="avatar-icon small-avatar"
                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                  />
                ) : (
                  <AccountCircleIcon className="avatar-icon small-avatar" style={{ fontSize: '24px' }} />
                )}
                <div className="profile-info">
                  <span className="name">{comment.UserName || '不明'}</span>
                  <span className="time">
                    {comment.CreatedAt &&
                      new Date(comment.CreatedAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </span>
                </div>
              </div>
              <div className="comment-content">
                <p className="comment-text">{comment.ReplyContent}</p>
              </div>
            </div>

            {/* Add a divider unless it's the last comment */}
            {index < comments.length - 1 && <div className="comment-divider"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="dm-input">
        <input
          type="text"
          placeholder="コメントを入力..."
          className="input-box"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="send-button"
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          <SendIcon className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default RequestDetail;

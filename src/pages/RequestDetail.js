import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Favorite, FavoriteBorder, Send as SendIcon, ArrowBack as ArrowBackIcon, Add as AddIcon } from '@mui/icons-material';
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
  const [liked, setLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Request data
        if (location.state) {
          const { id, name, time, content, imageSrc, liked, userIcon } = location.state;
          setRequest({ id, UserName: name, CreatedAt: time, RequestContent: content, RequestImage: imageSrc, UserIcon: userIcon });
          setLiked(liked);
        } else {
          const requestResponse = await fetch(`https://loopplus.mydns.jp/request/${id}`);
          if (!requestResponse.ok) throw new Error('Failed to fetch request details');
          const requestData = await requestResponse.json();
          setRequest(requestData);
          setLiked(requestData.isLiked);
        }

        // Comments data
        const commentsResponse = await fetch(`https://loopplus.mydns.jp/request/${id}/comment`);
        if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
        const commentsData = await commentsResponse.json();
        setComments(commentsData);

        // Current user
        const userResponse = await fetch('https://loopplus.mydns.jp/whoami', { credentials: 'include' });
        if (!userResponse.ok) throw new Error('Failed to fetch current user');
        const userData = await userResponse.json();
        setCurrentUser(userData);
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
        const newCommentData = {
          ...createdComment,
          name: currentUser.name,
          time: new Date().toISOString(),
        };
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment('');
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
        <div className="divider"></div>
        {comments.map((comment) => (
          <React.Fragment key={comment.ReplyID || comment.CreatedAt}>
            <div className={`comment ${currentUser && currentUser.UserID === comment.UserID ? 'user-comment' : 'other-comment'}`}>
              <div className="comment-header-wrapper">
                <AccountCircleIcon className="avatar-icon small-avatar" />
                <div className="comment-header">
                  <span className="name">{comment.name || '不明'}</span>
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
            <div className="divider"></div>
          </React.Fragment>
        ))}
      </div>

      <div className="dm-input">
        <button className="image-upload-button">
          <AddIcon className="add-icon" />
        </button>
        <input
          type="text"
          placeholder="メッセージを入力..."
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

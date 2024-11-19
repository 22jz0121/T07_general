import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Favorite,
  FavoriteBorder,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import tvImage from '../img/tv-image.png';
import '../css/RequestDetail.css';

function RequestDetail() {
  const navigate = useNavigate();

  // Comments state
  const initialComments = JSON.parse(localStorage.getItem('comments')) || [
    { id: 1, name: '電子太郎', text: '欲しいかもしれない', time: '3秒前', isUser: false },
    { id: 2, name: 'マサトシ', text: '売価', time: '1秒前', isUser: false },
  ];
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  // Like state
  const [liked, setLiked] = useState(false);

  // Save comments to localStorage
  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentEntry = {
        id: Date.now(),
        name: '自分の名前', // Replace with the logged-in user's name
        text: newComment,
        time: '今',
        isUser: true,
      };
      setComments([...comments, newCommentEntry]);
      setNewComment('');
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="request-detail-container">
      {/* Top Navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">リクエスト</h1>
      </div>

      {/* Main Request Post */}
      <div className="request-item">
        <div className="profile">
          <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
          <div className="profile-info">
            <span className="name">日本電子</span>
            <span className="time">3秒前</span>
          </div>
        </div>
        <div className="content">
          <p>お前が欲しい</p>
          <img src={tvImage} alt="Request" className="request-images" />
        </div>
        <div className="interaction-bar">
          <span className="comment-count">コメント {comments.length}</span>
          <div onClick={toggleLike} className="likes-button">
            {liked ? (
              <Favorite className="heart-icon liked" />
            ) : (
              <FavoriteBorder className="heart-icon" />
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <div className="divider"></div>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <div className={`comment ${comment.isUser ? 'user-comment' : 'other-comment'}`}>
              <div className="comment-header-wrapper">
                <AccountCircleIcon className="avatar-icon small-avatar" />
                <div className="comment-header">
                  <span className="name">{comment.name}</span>
                  <span className="time">{comment.time}</span>
                </div>
              </div>
              <div className="comment-content">
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
            {index < comments.length - 1 && <div className="divider"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Input Section */}
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

// src/pages/RequestDetail.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FavoriteBorder, Reply as ReplyIcon, Send as SendIcon, Image as ImageIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import tvImage from '../img/tv-image.png';
import '../css/RequestDetail.css';

function RequestDetail() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([
    { id: 1, name: '電子太郎', text: '欲しいかもしれない', time: '3秒前' },
    { id: 2, name: 'マサトシ', text: '売価', time: '1秒前' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentEntry = {
        id: Date.now(),
        name: '自分の名前', // Replace with the logged-in user's name
        text: newComment,
        time: '今'
      };
      setComments([...comments, newCommentEntry]);
      setNewComment('');
    }
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
          <img src={tvImage} alt="Request" className="request-image" />
        </div>
        <div className="interaction-bar">
          <span className="comment-count">コメント {comments.length}</span>
          <FavoriteBorder className="heart-icon" />
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="profile">
              <AccountCircleIcon className="avatar-icon small-avatar" />
              <div className="profile-info">
                <span className="name">{comment.name}</span>
                <span className="time">{comment.time}</span>
              </div>
            </div>
            <p className="comment-text">{comment.text}</p>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="comment-input-container">
        <ImageIcon className="image-icon" />
        <input
          type="text"
          placeholder="コメントを入力..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button onClick={handleCommentSubmit} className="send-button" disabled={!newComment.trim()}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default RequestDetail;

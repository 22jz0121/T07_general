import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import '../css/listingDetail.css'; // Make sure to style according to the uploaded design

function ListingDetail() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendComment = () => {
    if (inputValue.trim()) {
      const newComment = {
        id: Date.now(),
        user: '電子次郎', // Example username, could be fetched from user data
        text: inputValue,
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      };
      setComments([...comments, newComment]);
      setInputValue('');
    }
  };

  return (
    <div className="listing-detail-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">出品物</h1>
      </div>

      <div className="listing-content">
        <div className="listing-header">
          <AccountCircleIcon className="avatar-icon" style={{ fontSize: '40px', color: '#374151' }} />
          <span className="user-name">日本電子</span>
          <span className="listing-time">3秒前</span>
        </div>

        <img src="/img/tv-image.png" alt="Listing" className="listing-image" />

        <div className="listing-details">
          <h2>55インチのスマートテレビ</h2>
          <p>最新の4K対応です。55インチのスマートテレビです。親に言って来いと言われたのでほしい人がいればお譲りします。</p>

          <div className="transaction-details">
            <span>希望取引方法:</span>
            <span className="badge">譲渡</span>
          </div>

          <div className="location-details">
            <span>受け渡し場所:</span>
            <span>12号館前</span>
          </div>

          <button className="transaction-button">取引手続きへ</button>
          <FavoriteBorderIcon className="favorite-icon" />
        </div>
      </div>

      <div className="comments-section">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <AccountCircleIcon className="comment-avatar" style={{ fontSize: '30px', color: '#7C90B4' }} />
            <div className="comment-content">
              <span className="comment-user">{comment.user}</span>
              <span className="comment-time">{comment.time}</span>
              <p className="comment-text">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="comment-input">
        <button className="image-upload-button">
          <img src="/icons/add-icon.png" alt="Add" className="add-icon" />
        </button>
        <input
          type="text"
          placeholder="コメントを入力..."
          className="input-box"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="send-button" onClick={handleSendComment} disabled={!inputValue.trim()}>
          <SendIcon className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default ListingDetail;

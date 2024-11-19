import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PostButton from './PostButton';
import '../css/RequestPage.css';

function RequestItem({ id, name, time, description, imageSrc }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false); // Manage the like state

  const handleLikeClick = (e) => {
    e.stopPropagation(); // Prevent navigation when liking
    setLiked(!liked);
  };

  const handleClick = () => {
    navigate(`/request/${id}`);
  };

  return (
    <div className="request-item" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="profile">
        <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
        <div className="profile-info">
          <span className="name">{name}</span>
          <span className="time">{time}</span>
        </div>
      </div>
      <div className="content">
        <p>{description}</p>
        {imageSrc && <img src={imageSrc} alt="Request" className="request-image" />}
      </div>
      <div className="like-button" onClick={handleLikeClick}>
        {liked ? (
          <FavoriteIcon className="liked-icon" style={{ color: 'red' }} />
        ) : (
          <FavoriteBorderIcon className="like-icon" />
        )}
      </div>
    </div>
  );
}

function RequestList({ userId, showPostButton = true }) { // Add showPostButton prop
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('requests')) || [];
    const userRequests = storedRequests.filter((request) => request.userId === userId);
    setRequests(userRequests);
  }, [userId]);

  return (
    <div className="request-list">
      {requests.length > 0 ? (
        requests.map((request) => (
          <RequestItem
            key={request.id}
            id={request.id}
            name={request.name}
            time={request.time}
            description={request.description}
            imageSrc={request.imageSrc}
          />
        ))
      ) : (
        <p className="p">リクエストはありません。</p>
      )}
      {showPostButton && <PostButton />} {/* Conditionally render PostButton */}
    </div>
  );
}

export default RequestList;

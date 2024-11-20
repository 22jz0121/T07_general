import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/top.css';

function Item({ itemId, name, time, imageSrc, title, description, location, transactionMethods, onLike }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  // Toggle the liked state and optionally call the onLike function
  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(itemId); // Call parent component's function if provided
    }
  };

  const handleItemClick = () => {
    navigate(`/listing/${itemId}`);
  };

  return (
    <div className="item" onClick={handleItemClick} style={{ cursor: 'pointer' }}>
      <div className="profile">
        <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
        <div className="profile-info">
          <span className="name">{name}</span>
          <span className="time">{time.split(':').slice(0, 2).join(':')}</span>
        </div>
      </div>
      <div className="item-content">
        <img src={imageSrc} alt="Item" className="item-image" />
        <div className="item-info">
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="action-buttons">
            {transactionMethods &&
              transactionMethods.map((method) => (
                <button
                  key={method}
                  className={`button ${
                    method === '譲渡' ? 'trade' : method === 'レンタル' ? 'rental' : 'exchange'
                  }`}
                >
                  {method}
                </button>
              ))}
          </div>
          <div className="item-footer">
            <span className="location">{location}</span>
            <span
              onClick={(e) => {
                e.stopPropagation(); // Prevent click event from propagating to parent
                handleLike();
              }}
              className="heart"
            >
              {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;

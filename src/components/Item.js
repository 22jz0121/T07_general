import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/top.css';

function Item({ itemId, name, time, imageSrc, title, description, location }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleItemClick = () => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="item" onClick={handleItemClick} style={{ cursor: 'pointer' }}>
      <div className="profile">
        <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
        <div className="profile-info">
          <span className="name">{name}</span>
          <span className="time">{time}</span>
        </div>
      </div>
      <div className="item-content">
        <img src={imageSrc} alt="Item Image" className="item-image" />
        <div className="item-info">
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="action-buttons">
            <button className="button trade">譲渡</button>
          </div>
          <span className="location">{location}</span>
          <span onClick={(e) => { e.stopPropagation(); handleLike(); }} className="heart">
            {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Item;

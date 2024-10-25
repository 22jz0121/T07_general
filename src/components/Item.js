import React, { useState } from 'react';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material'; // Import Material UI heart icons
import avatar1 from '../img/avatar1.png';
import '../css/top.css';

function Item({ name, time, imageSrc, title, description, location }) {
  const [liked, setLiked] = useState(false); // State to track if the heart is clicked

  // Toggle the liked state
  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="item">
      <div className="profile">
        <img src={avatar1} alt="Avatar" className="avatar" />
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
          
          {/* Heart icon that toggles color when clicked */}
          <span onClick={handleLike} className="heart">
            {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Item;

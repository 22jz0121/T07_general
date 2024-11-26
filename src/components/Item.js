import React, { useState, useEffect } from 'react';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/top.css';

function Item({ itemId, name, time, imageSrc, title, description, location, onLike, liked: initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);

  useEffect(() => {
    setLiked(initialLiked); // 親からの初期値を設定
  }, [initialLiked]);

  const handleLike = () => {
    const newLikedState = !liked; // 新しい状態を計算
    setLiked(newLikedState); // ローカルの状態を更新
    onLike(itemId); // 親コンポーネントの関数を呼び出す
  };

  return (
    <div className="item">
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
          <span onClick={handleLike} className="heart">
            {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Item;

import React, { useState, useEffect } from 'react';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom'; // Linkをインポート
import '../css/top.css';
//locationを削除
function Item({ itemId, userId, name, time, imageSrc, title, description, onLike, liked: initialLiked, userIcon }) {
  const [liked, setLiked] = useState(initialLiked);

  useEffect(() => {
    setLiked(initialLiked); // 親からの初期値を設定
  }, [initialLiked]);

  const handleLike = (event) => {
    event.stopPropagation(); // 親のクリックイベントを防ぐ
    const newLikedState = !liked; // 新しい状態を計算
    setLiked(newLikedState); // ローカルの状態を更新
    onLike(itemId); // 親コンポーネントの関数を呼び出す
  };
  const iconSrc = userIcon && userIcon.startsWith('storage/images/') 
    ? `https://loopplus.mydns.jp/${userIcon}` 
    : userIcon;

  return (
    <div className="item">
      <Link to={`/profile/${userId}`} >
        <div className="profile">
          {userIcon ? (
              <img src={iconSrc} alt="User Icon" className="avatar-icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          ) : (
              <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
          )}
          <div className="profile-info">
            <span className="name">{name}</span>
            <span className="time">{time}</span>
          </div>
        </div>
      </Link>
      <div className="item-link-container"> {/* Linkを外に出す */}
        <Link 
        to={`/listing/${itemId}`} 
        state={{ itemId, userId, name, time, description, imageSrc, liked, title, userIcon}} // stateを利用

        className="item-link">
          <div className="item-content">
            <img src={imageSrc} alt="Item Image" className="item-image" />
            <div className="item-info">
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="action-buttons">
                <button className="button trade">譲渡</button>
              </div>            
            </div>
          </div>
        </Link>
          <div className='ppppppp'>
            {/* <span className="location">受渡場所：{location}</span> */}
            <span onClick={handleLike} className="heart">
              {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
            </span>
          </div>
      </div>
    </div>
  );
}

export default Item;

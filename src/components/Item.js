import React, { useState, useEffect } from 'react';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom'; // Linkをインポート
import '../css/top.css';
//locationを削除
function Item({ itemId, userId, name, time, imageSrc, title, description, onLike, liked: initialLiked, userIcon, tradeFlag, transactionMethods = [0] }) {
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

  // tradeFlagに基づく表示メッセージ
  let tradeStatus;
  switch (tradeFlag) {
    case 0:
      tradeStatus = "出品中";
      break;
    case 1:
      tradeStatus = "取引中";
      break;
    case 2:
      tradeStatus = "取引終了";
      break;
    default:
      tradeStatus = "状態不明"; // 予期しない値の場合
  }

  // 取引方法の表示
  const methodsDisplay = transactionMethods.length > 0 
  ? transactionMethods.join(', ') 
  : "取引方法が選択されていません";
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
        state={{ itemId, userId, name, time, description, imageSrc, liked, title, userIcon, tradeFlag, transactionMethods }} // stateを利用

        className="item-link">
          <div className="item-content">
            <img src={imageSrc} alt="Item Image" className="item-image" />
            <div className="item-info">
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="action-buttons">
              <p className="methods-display">{methodsDisplay}</p>
              <p className="trade-status">{tradeStatus}</p>
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

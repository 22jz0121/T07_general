import React, { useState, useEffect } from 'react';
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import '../css/top.css';

function Item({ itemId, userId, name, time, imageSrc, title, description, onLike, liked: initialLiked, userIcon, tradeFlag, transactionMethods = [0], showDeleteButton, onDelete }) {
  const [liked, setLiked] = useState(initialLiked);

  useEffect(() => {
    setLiked(initialLiked); // 親からの初期値を設定
  }, [initialLiked]);

  const handleLike = (event) => {
    event.stopPropagation(); // 親のクリックイベントを防ぐ
    const newLikedState = !liked; // いいねの状態をトグル
    setLiked(newLikedState); // ローカルステートを更新
    onLike(itemId); // 親のハンドラーをトリガー
  };

  const iconSrc = userIcon && userIcon.startsWith('storage/images/') 
    ? `https://loopplus.mydns.jp/${userIcon}` 
    : userIcon;

  // 日付フォーマットのヘルパー関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // 日付が無効な場合、適切なエラーメッセージを返す
    if (isNaN(date.getTime())) {
      return "無効な日付"; // または適切なデフォルトメッセージ
    }

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('ja-JP', options); // 必要に応じてロケールを調整
  };

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
      tradeStatus = "状態不明";
  }

  // Method CSS class assignment
  const methodClassMapping = {
    譲渡: 'trade',
    レンタル: 'rental',
    交換: 'exchange',
  };

  const methodsDisplay = transactionMethods.length > 0 
    ? transactionMethods.map((method, index) => (
        <span key={index} className={`method-badge ${methodClassMapping[method] || ''}`}>
          {method}
        </span>
      ))
    : "取引方法が選択されていません";

  return (
    <div className="item">
      {showDeleteButton && onDelete && (
        <IconButton
          onClick={() => onDelete(itemId)}
          aria-label="delete"
          className="delete-button"
        >
          <DeleteIcon />
        </IconButton>
      )}
      <Link to={`/profile/${userId}`} className="link">
        <div className="profile">
          {userIcon ? (
              <img src={iconSrc} alt="ユーザーアイコン" className="avatar-icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          ) : (
              <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
          )}
          <div className="profile-info">
            <span className="name">{name}</span>
            <span className="time">{formatDate(time)}</span>
          </div>
        </div>
      </Link>
      <div className="item-link-container">
        <Link 
          to={`/listing/${itemId}`} 
          state={{ itemId, userId, name, time, description, imageSrc, liked, title, userIcon, tradeFlag, transactionMethods }} 
          className="item-link"
        >
          <div className="item-content">
            <img src={imageSrc} alt="アイテム画像" className="item-image" />
            <div className="item-info">
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="action-buttons">
                <div className="methods-display">{methodsDisplay}</div>
                <p className="trade-status">{tradeStatus}</p>
              </div>            
            </div>
          </div>
        </Link>
        <div className='ppppppp'>
          <span onClick={handleLike} className="heart">
            {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Item;

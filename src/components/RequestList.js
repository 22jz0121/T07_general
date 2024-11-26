import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PostButton from './PostButton';
import '../css/RequestPage.css';

function RequestItem({ id, name, time, content, imageSrc, onLike, liked: initialLiked}) {
  const [liked, setLiked] = useState(initialLiked);

  useEffect(() => {
    setLiked(initialLiked); // 親からの初期値を設定
  }, [initialLiked]);

  const handleLike = () => {
    const newLikedState = !liked; // 新しい状態を計算
    setLiked(newLikedState); // ローカルの状態を更新
    onLike(id); // 親コンポーネントの関数を呼び出す
  };

  return (
    <div className="request-item" onClick={handleLike} style={{ cursor: 'pointer' }}>
      <div className="profile">
        <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
        <div className="profile-info">
          <span className="name">{name}</span>
          <span className="time">{time}</span>
        </div>
      </div>
      <div className="content">
        <p>{content}</p>
        {imageSrc && <img src={imageSrc} alt="Request" className="request-image" />}
      </div>
      <div className="like-button" onClick={handleLike}>
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
  const [loading, setLoading] = useState(true);
  const [likedRequests, setLikedItems] = useState([]); // ユーザーがいいねしたアイテム
  const [myFavoriteReqIds, setMyFavoriteIds] = useState([]); // /myfavorite から取得したアイテムID
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchRequests = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/request');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isMounted.current) {
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    const fetchMyFavorites = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/api/myfavorite', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isMounted.current) {
          setMyFavoriteIds(data.map(item => item.ItemID));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchRequests();
    fetchMyFavorites();

    return () => {
      isMounted.current = false;
    };

  }, []);

  const handleLike = (itemId) => {
    console.log('handleLike called with itemId:', itemId);
    const isLiked = likedRequests.includes(itemId);
    const isMyFavorite = myFavoriteReqIds.includes(itemId); // /myfavoriteから取得したIDと比較

    // DELETEかPOSTかを判断
    const method = isMyFavorite ? 'DELETE' : 'POST';
    sendFavoriteRequest(itemId, method);

    // likedItemsの更新
    setLikedItems((prevLikedItems) => {
      return isLiked ? prevLikedItems.filter(id => id !== itemId) : [...prevLikedItems, itemId];
    });
  };

  const sendFavoriteRequest = async (itemId, method) => {
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${itemId}`, {
        method: method,
        credentials: 'include',
        // headers: {
          // 'Content-Type': 'application/json',
          // 'X-CSRF-TOKEN': csrfToken,
        // },
        // POSTの場合はボディを追加、DELETEの場合はボディを付けない
        // body: method === 'POST' ? JSON.stringify({ itemId }) : undefined,
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // エラーレスポンスを取得
        console.error('Error response:', errorData); // エラーレスポンスをログに出力
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="request-list">
      {requests.length > 0 ? (
        requests.map((request) => (
          <RequestItem
            key={request.RequestID}
            id={request.RequestID}
            content={request.RequestContent}
            imageSrc={`https://loopplus.mydns.jp/${request.RequestImage}`}
            name={request.User ? request.User.UserName : '不明'} // ユーザー名を渡す
            userIcon={request.User && request.User.Icon ? request.User.Icon : 'default-icon-url.jpg'}
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

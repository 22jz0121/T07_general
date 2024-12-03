import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PostButton from './PostButton';
import '../css/RequestPage.css';

function RequestItem({ id, name, time, content, imageSrc, liked, onLike }) {
  const handleLike = () => {
    onLike(id); // 親から渡されたいいね処理を呼び出す
  };

  return (
    <div className="request-item">
      <Link to={`/request/${id}`} className="request-link">
        {/* リンクに詳細ページへの遷移を組み込む */}
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
      </Link>
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

function RequestList({ showPostButton = true }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedRequests, setLikedRequests] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchRequests = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/request');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        if (isMounted.current) {
          setRequests(data);
          const likedIds = data.filter((item) => item.isLiked).map((item) => item.RequestID);
          setLikedRequests(likedIds); // 初期のいいね済みIDを設定
        }
      } catch (error) {
        setError(error.message);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLike = async (id) => {
    const isLiked = likedRequests.includes(id);
    const method = isLiked ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${id}`, {
        method,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      // フロントエンドの状態を更新
      setLikedRequests((prevLiked) =>
        isLiked ? prevLiked.filter((likedId) => likedId !== id) : [...prevLiked, id]
      );
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  if (loading) {
    return <div className='loading'><img src='/Loading.gif' alt="Loading"/></div>;  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="request-list">
      {requests.length > 0 ? (
        requests.map((request) => (
          <RequestItem
            key={request.RequestID}
            id={request.RequestID}
            name={request.User ? request.User.UserName : '不明'}
            time={request.createdAt}
            content={request.RequestContent}
            imageSrc={`https://loopplus.mydns.jp/${request.RequestImage}`}
            liked={likedRequests.includes(request.RequestID)}
            onLike={handleLike}
          />
        ))
      ) : (
        <p>リクエストはありません。</p>
      )}
      {showPostButton && <PostButton />} {/* Postボタンの表示を条件付け */}
    </div>
  );
}

export default RequestList;

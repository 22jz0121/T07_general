import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PostButton from './PostButton';
import '../css/RequestPage.css';

function RequestItem({ id, name, time, content, imageSrc, liked, onLike, userIcon }) {
  const handleLike = () => {
    onLike(id); // 親から渡されたいいね処理を呼び出す
  };

  const iconSrc = userIcon && userIcon.startsWith('storage/images/') 
    ? `https://loopplus.mydns.jp/${userIcon}` 
    : userIcon;
  return (
    <div className="request-item">
      <Link
        to={`/request/${id}`}
        state={{ id, name, time, content, imageSrc, liked }} // stateを利用
        className="request-link"
      >
        <div className="profile">
          {userIcon ? (
              <img src={iconSrc} alt="User Icon" className="avatar-icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          ) : (
              <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
          )}
          <div className="profile-info">
            <span className="name">{name}</span>
            <span className="time">{new Date(time).toLocaleDateString()} {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
    fetchRequests();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://loopplus.mydns.jp/request');
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();

      if (isMounted.current) {
        const sortedData = data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setRequests(sortedData);

        const likedIds = sortedData.filter((item) => item.isLiked).map((item) => item.RequestID);
        setLikedRequests(likedIds);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

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

      setLikedRequests((prevLiked) =>
        isLiked ? prevLiked.filter((likedId) => likedId !== id) : [...prevLiked, id]
      );
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  if (loading) {
    return <div className='loading'><img src='/Loading.gif' alt="Loading" /></div>; 
  }

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
            time={request.CreatedAt}
            content={request.RequestContent}
            imageSrc={request.RequestImage ? `https://loopplus.mydns.jp/${request.RequestImage}` : null}
            liked={likedRequests.includes(request.RequestID)}
            onLike={handleLike}
            userIcon={request.User && request.User.Icon}
          />
        ))
      ) : (
        <p>リクエストはありません。</p>
      )}
      {showPostButton && <PostButton />}
    </div>
  );
}

export default RequestList;

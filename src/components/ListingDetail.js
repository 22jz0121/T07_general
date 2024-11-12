import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import tvImage from '../img/tv-image.png';
import '../css/listingDetail.css';

function ListingDetail() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="listing-detail-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">出品物</h1>
      </div>

      <div className="listing-content">
        <div className="listing-header">
          <AccountCircleIcon className="avatar-icon" style={{ fontSize: '40px', color: '#374151' }} />
          <span className="user-name">日本電子</span>
          <span className="listing-time">3秒前</span>
        </div>

        <img src={tvImage} alt="Listing" className="listing-image" />

        <div className="listing-details">
          <h2>55インチのスマートテレビ</h2>
          <p>最新の4K対応で、55インチのスマートテレビです。親に言って来いと言われたのでほしい人がいればお譲りします。</p>

          <div className="transaction-details">
            <span>希望取引方法:</span>
            <span className="badge">譲渡</span>
          </div>

          <div className="location-details">
            <span>受け渡し場所:</span>
            <span>12号館</span>
          </div>

          <div className="transaction-button-container">
            <button
              className="transaction-button"
              onClick={() => navigate(`/transaction/${listingId}`)}
            >
              取引手続きへ
            </button>
            <span onClick={handleLike} className="heart-icon">
              {liked ? <Favorite style={{ color: 'red' }} /> : <FavoriteBorder />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;

// import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'; // useEffectをインポート
// import tvImage from '../img/tv-image.png';
import '../css/listingDetail.css';

function ListingDetail() {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [itemDetails, setItemDetails] = useState(null); // アイテム詳細を保存するステート
  const [liked, setLiked] = useState(false);

  // アイテムの詳細を取得
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/item/${listingId}`);
        if (!response.ok) throw new Error('Failed to fetch item details');
        
        const data = await response.json();
        setItemDetails(data); // 取得したデータをステートに設定
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [listingId]);

  const handleLike = () => {
    setLiked(!liked);
  };

  if (!itemDetails) {
    return <div>Loading...</div>; // ローディング表示
  }

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
          <span className="user-name">{itemDetails.User.UserName}</span> {/* ユーザー名 */}
          <span className="listing-time">{itemDetails.CreatedAt}</span> {/* 登録日時 */}
        </div>

        <img src={`https://loopplus.mydns.jp/${itemDetails.ItemImage}`} alt="Listing" className="listing-image" />


        <div className="listing-details">
          <h2>{itemDetails.ItemName}</h2> {/* アイテム名 */}
          <p>{itemDetails.Description}</p> {/* アイテムの説明 */}

          <div className="transaction-details">
            <div>
              <span>希望取引方法:</span>
              <span className="badge">譲渡</span>
            </div>
            <div>
              <span
                className="tttt"
                style={{ cursor: 'pointer'}} // Optional styling
                onClick={() => window.open('https://forms.gle/YMW4aqQLWQ5vEzaUA', '_blank')}
              >
                通報する
              </span>
            </div>
          </div>

          <div className="location-details">
            {/* <p className='ppp'>受け渡し場所:12号館</p> */}
            <span onClick={handleLike} className="heart-icon">
              {liked ? <Favorite style={{ color: 'red' }} /> : <FavoriteBorder />}
            </span>
          </div>

          <div className="transaction-button-container">
            <button
              className="transaction-button"
              onClick={() => navigate(`/transaction/${listingId}`)}
            >
              取引手続きへ
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;

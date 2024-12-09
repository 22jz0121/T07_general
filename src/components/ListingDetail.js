import React, { useEffect, useState } from 'react'; // useEffectをインポート
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../css/listingDetail.css';

function ListingDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();
  const [itemDetails, setItemDetails] = useState(null); // アイテム詳細を保存するステート
  const [liked, setLiked] = useState(false);
  // アイテムの詳細を取得
  useEffect(() => {
    let isMounted = true; // マウント状態を追跡

    const fetchItemDetails = async () => {
      const { itemId, name, time, description, imageSrc, liked, title} = location.state;
      setItemDetails({ itemId, UserName: name, CreatedAt: time, itemContent: description, itemImage: imageSrc,itemName: title});
      setLiked(liked);
    };

    fetchItemDetails();

    return () => {
      isMounted = false; // アンマウントされた際にフラグを更新
    };
  }, [listingId]);

  const handleLike = () => {
    setLiked(!liked);
  };

  if (!itemDetails) {
    return <div>Loading...</div>; // ローディング表示
  }
  // itemDetailsから必要なプロパティを取得
  const { UserName, CreatedAt, itemImage, itemName, itemContent } = itemDetails;
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
          <span className="user-name">{UserName || 'ユーザー名が取得できません'}</span> {/* ユーザー名 */}
          <span className="listing-time">{CreatedAt}</span> {/* 登録日時 */}
        </div>

        <img src={itemImage} alt="Listing" className="listing-image" />

        <div className="listing-details">
          <h2>{itemName}</h2> {/* アイテム名 */}
          <p>{itemContent}</p> {/* アイテムの説明 */}

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

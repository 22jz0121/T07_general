import React, { useEffect, useState, useRef } from 'react'; // useEffectをインポート
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
  const [likedItems, setLikedItems] = useState([]);       // ユーザーがいいねしたアイテム
  const [myFavoriteIds, setMyFavoriteIds] = useState([]); // /ユーザーがいいねしているアイテムのID
  const isMounted = useRef(true);
  // アイテムの詳細を取得
  useEffect(() => {
    let isMounted = true; // マウント状態を追跡

    const fetchItemDetails = async () => {
      const { itemId, name, time, description, imageSrc, liked, title} = location.state;
      setItemDetails({ itemId, UserName: name, CreatedAt: time, itemContent: description, itemImage: imageSrc,itemName: title});
      setLiked(liked);
    };

    fetchItemDetails();
    fetchMyFavorites();

    return () => {
      isMounted = false; // アンマウントされた際にフラグを更新
    };
  }, [listingId]);

  //自分のお気に入りを取得
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


  //お気に入りボタンが押されたときの処理
  const handleLike = (itemId) => {
    const newLikedState = !liked; // 新しい状態を計算
    setLiked(newLikedState); // ローカルの状態を更新

    console.log('handleLike called with itemId:', itemId);
    //likedItems 配列に itemId が含まれているかを確認し、含まれていれば isLiked が trueに
    const isLiked = likedItems.includes(itemId);
    //↑の亜種
    const isMyFavorite = myFavoriteIds.includes(itemId); // /myfavoriteから取得したIDと比較

    // DELETEかPOSTかを判断し切り替え処理へ
    const method = isMyFavorite ? 'DELETE' : 'POST';
    sendFavoriteRequest(itemId, method);

    // likedItemsの更新
    setLikedItems((prevLikedItems) => {
      return isLiked ? prevLikedItems.filter(id => id !== itemId) : [...prevLikedItems, itemId];
    });
    // setLiked(!isLiked);
  };


  //お気に入り切り替え処理
  const sendFavoriteRequest = async (itemId, method) => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${itemId}`, {
        method: method,
        credentials: 'include',
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

  if (!itemDetails) {
    return <div>Loading...</div>; // ローディング表示
  }
  console.log('Location state:', location.state); // location.stateの内容を確認

  // itemDetailsから必要なプロパティを取得
  const { UserName, CreatedAt, itemImage, itemName, itemContent, itemId, title} = itemDetails;
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
            <span onClick={() => handleLike(itemDetails.itemId)} className="heart-icon">
              {liked ? <Favorite style={{ color: 'red' }} /> : <FavoriteBorder />}
            </span>
          </div>

          <div className="transaction-button-container">
            <button
              className="transaction-button"
              onClick={() => {
                console.log('Navigating with title:', title); // ここでtitleを確認
                navigate(`/transaction/${listingId}`, { 
                  state: { 
                    itemId, 
                    name: UserName, 
                    time: CreatedAt, 
                    description: itemContent, 
                    imageSrc: itemImage, 
                    itemName: title 
                  } 
                });
              }}
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

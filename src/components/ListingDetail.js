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
  const [tradeFlag, setTradeFlag] = useState(null); // tradeFlagを保持するための変数
  const isMounted = useRef(true);

  // セッションからユーザーIDを取得
  const myID = sessionStorage.getItem('MyID');

  // アイテムの詳細を取得
  useEffect(() => {
    let isMounted = true; // マウント状態を追跡

    const fetchItemDetails = async () => {
      const { itemId, userId, name, time, description, imageSrc, liked, title, userIcon, tradeFlag, transactionMethods
      } = location.state;

      setItemDetails({
        itemId, userId, UserName: name, CreatedAt: time, itemContent: description, itemImage: imageSrc, itemName: title, userIcon, tradeFlag, transactionMethods
      });

      console.log('Fetched transactionMethods:', transactionMethods);
      setLiked(liked);
      setTradeFlag(tradeFlag);
    };

    fetchItemDetails();
    fetchMyFavorites();

    console.log(tradeFlag);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('ja-JP', options); // Adjust locale as needed
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
  const { UserName, userId, CreatedAt, itemImage, itemName, itemContent, itemId, userIcon } = itemDetails;
  const iconSrc = userIcon && userIcon.startsWith('storage/images/')
    ? `https://loopplus.mydns.jp/${userIcon}`
    : userIcon;

  // 現在のユーザーが出品者かどうかを判定
  const isSeller = userId == myID; // セッションから取得したmyIDと比較
  const tradeFlagValid = [1, 2, 3].includes(tradeFlag);

  // ボタンの表示条件
  const showTransactionButton = !isSeller && !tradeFlagValid;
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
          {userIcon ? (
            <img src={iconSrc} alt="User Icon" className="avatar-icon" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          ) : (
            <AccountCircleIcon className="avatar-icon" style={{ fontSize: '40px' }} />
          )}
          <span className="user-name">{UserName || 'ユーザー名が取得できません'}</span> {/* ユーザー名 */}
          <span className="listing-time">{formatDate(CreatedAt)}</span>
        </div>

        <img src={itemImage} alt="Listing" className="listing-image" />

        <div className="listing-details">
          <h2>{itemName}</h2> {/* アイテム名 */}
          <p className='popopo'>{itemContent}</p> {/* アイテムの説明 */}

          <div className="transaction-details">
            <div className="transaction-methods">
              <span className="popo">希望取引方法:</span>
              {itemDetails.transactionMethods && itemDetails.transactionMethods.length > 0 ? (
                Array.isArray(itemDetails.transactionMethods)
                  ? itemDetails.transactionMethods.flatMap(method =>
                    method.split(',').map(m => m.trim())
                  ).map((method, index) => (
                    <span key={index} className={`method-badge ${method === '譲渡' ? 'trade' : method === 'レンタル' ? 'rental' : 'exchange'}`}>
                      {method}
                    </span>
                  ))
                  : <span className="badge">取引方法が選択されていません</span>
              ) : (
                <span className="badge">取引方法が選択されていません</span>
              )}
            </div>
          </div>

          <div className="location-details">
            <div>
              <span
                className="tttt"
                style={{ cursor: 'pointer' }} // Optional styling
                onClick={() => window.open('https://forms.gle/YMW4aqQLWQ5vEzaUA', '_blank')}
              >
                通報する
              </span>
            </div>
            <span onClick={() => handleLike(itemDetails.itemId)} className="heart-icon">
              {liked ? <Favorite style={{ color: 'red' }} /> : <FavoriteBorder />}
            </span>
          </div>

          <div className="transaction-button-container">
            {showTransactionButton && ( // ボタンの表示条件を追加
              <button
                className="transaction-button"
                onClick={() => {
                  console.log('Navigating with itemName:', itemName);
                  navigate(`/transaction/${listingId}`, {
                    state: {
                      itemId,
                      itemName,
                      userId,
                      name: UserName,
                      time: CreatedAt,
                      description: itemContent,
                      imageSrc: itemImage,
                    }
                  });
                }}
              >
                取引手続きへ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;

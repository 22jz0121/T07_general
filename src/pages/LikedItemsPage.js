import React, { useEffect, useState, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Item from '../components/Item';
import '../css/LikedItemsPage.css';

const LikedItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [myFavoriteIds, setMyFavoriteIds] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [selectedTradeFlag, setSelectedTradeFlag] = useState(0); // トレードフラグの状態
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchItems = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/api/item');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isMounted.current) {
          setItems(data);
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

    fetchItems();
    fetchMyFavorites();

    return () => {
      isMounted.current = false; // クリーンアップ時にフラグを更新
    };
  }, []);

  useEffect(() => {
    if (items.length > 0 && myFavoriteIds.length > 0) {
      const storedLikedItems = items.filter(item => myFavoriteIds.includes(item.ItemID));
      const sortedLikedItems = storedLikedItems.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
      setFavoriteItems(sortedLikedItems);
    }
  }, [items, myFavoriteIds]);

  const handleLike = (itemId) => {
    console.log('handleLike called with itemId:', itemId);
    const isLiked = likedItems.includes(itemId);
    const isMyFavorite = myFavoriteIds.includes(itemId);

    const method = isMyFavorite ? 'DELETE' : 'POST';
    sendFavoriteRequest(itemId, method);

    setLikedItems((prevLikedItems) => {
      return isLiked ? prevLikedItems.filter(id => id !== itemId) : [...prevLikedItems, itemId];
    });
  };

  const sendFavoriteRequest = async (itemId, method) => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${itemId}`, {
        method: method,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleTradeFlagChange = (event) => {
    const value = Number(event.target.value);
    console.log('Trade Flag Changed to:', value);
    setSelectedTradeFlag(value);
  };

  const filteredFavoriteItems = favoriteItems.filter(
    (item) => item.TradeFlag === selectedTradeFlag
  );

  return (
    <div className="liked-items-page">
      {/* Top Navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">いいねした物品</h1>
      </div>

      {/* トレードフラグの選択 */}
      <div className="pull-container">
        <select id="tradeFlag" value={selectedTradeFlag} onChange={handleTradeFlagChange}>
          <option value={0}>出品中</option>
          <option value={1}>取引中</option>
          <option value={2}>取引完了</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">
          <img src="/Loading.gif" alt="Loading" />
        </div>
      ) : (
        <div className="tab-content">
          {filteredFavoriteItems.length > 0 ? (
            <div>
              {filteredFavoriteItems.map(item => (
                <Item
                  key={item.ItemID}
                  name={item.User ? item.User.UserName : '不明'} // ユーザー名を渡す
                  userIcon={item.User && item.User.Icon}
                  itemId={item.ItemID}
                  title={item.ItemName}
                  imageSrc={`https://loopplus.mydns.jp/${item.ItemImage}`}
                  description={item.Description}
                  onLike={handleLike}
                  liked={myFavoriteIds.includes(item.ItemID)}
                  time={item.CreatedAt}
                  transactionMethods={item.TradeMethod ? [item.TradeMethod] : []}
                />
              ))}
            </div>
          ) : (
            <p className="pp">いいねした物品はありません。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LikedItemsPage;

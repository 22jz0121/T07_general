import React, { useEffect, useState, useRef } from 'react';
import Item from './Item';

function ItemList() {
  const [items, setItems] = useState([]);                 
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState([]);       
  const [myFavoriteIds, setMyFavoriteIds] = useState([]); 
  const [error, setError] = useState(null);
  const [selectedTradeFlag, setSelectedTradeFlag] = useState(0); // トレードフラグの状態を管理
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    fetchItems();
    fetchMyFavorites();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://loopplus.mydns.jp/item');
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

  const handleLike = (itemId) => {
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
    setSelectedTradeFlag(Number(event.target.value)); // 選択されたトレードフラグを設定
  };

  if (loading) {
    return <div className='loading'><img src='/Loading.gif' alt="Loading" /></div>;
  }

  return (
    <div className='listing'>
      <div className="select-container">
        <select id="tradeFlag" value={selectedTradeFlag} onChange={handleTradeFlagChange}>
          <option value={0}>出品中</option>
          <option value={1}>取引中</option>
          <option value={2}>取引完了</option>
        </select>
      </div>
      {items
        .filter(item => item.TradeFlag === selectedTradeFlag) // 選択されたトレードフラグでフィルタリング
        .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
        .map(item => (
          item.TradeFlag !== 3 && (
            <Item
              key={item.ItemID}
              name={item.User ? item.User.UserName : '不明'}
              userIcon={item.User && item.User.Icon}
              userId={item.UserID}
              itemId={item.ItemID}
              title={item.ItemName}
              imageSrc={`https://loopplus.mydns.jp/${item.ItemImage}`}
              description={item.Description}
              tradeFlag={item.TradeFlag}
              onLike={handleLike}
              liked={myFavoriteIds.includes(item.ItemID)}
              transactionMethods={item.TradeMethod ? [item.TradeMethod] : []}
              time={item.CreatedAt}
            />
          )
        ))}
    </div>
  );
}

export default ItemList;

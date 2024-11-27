import React, { useEffect, useState, useRef } from 'react';
import Item from './Item';

function ItemList() {
  const [items, setItems] = useState([]);                 //表示するアイテム
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState([]);       // ユーザーがいいねしたアイテム
  const [myFavoriteIds, setMyFavoriteIds] = useState([]); // /ユーザーがいいねしているアイテムのID
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  //最初に行う処理
  useEffect(() => {
    isMounted.current = true;

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

    fetchItems();
    fetchMyFavorites();

    return () => {
      isMounted.current = false;
    };
  }, []);


  //お気に入りボタンが押されたときの処理
  const handleLike = (itemId) => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {items.map(item => (
        <Item 
          key={item.ItemID} 
          name={item.User ? item.User.UserName : '不明'} // ユーザー名を渡す
          userIcon={item.User && item.User.Icon ? item.User.Icon : 'default-icon-url.jpg'}
          itemId={item.ItemID} 
          title={item.ItemName} 
          imageSrc={`https://loopplus.mydns.jp/${item.ItemImage}`}
          description={item.Description} 
          onLike={handleLike}
          liked={myFavoriteIds.includes(item.ItemID)}
        />
      ))}
    </div>
  );
}

export default ItemList;
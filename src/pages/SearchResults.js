// src/pages/SearchResults.js

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Item from '../components/Item';
import '../css/searchResults.css';

function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = location.state || []; // APIからの結果を取得

  const [myFavoriteIds, setMyFavoriteIds] = useState([]); // ユーザーのいいねしたアイテムID
  const isMounted = useRef(true);

  // マウント時にお気に入りを取得
  useEffect(() => {
    isMounted.current = true;
    fetchMyFavorites();

    return () => {
      isMounted.current = false; // アンマウントされた際にフラグを更新
    };
  }, []);

  // 自分のお気に入りを取得
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

  // お気に入りボタンが押されたときの処理
  const handleLike = (itemId) => {
    const isMyFavorite = myFavoriteIds.includes(itemId); // お気に入りの状態を確認
    const method = isMyFavorite ? 'DELETE' : 'POST'; // お気に入りの切り替え

    sendFavoriteRequest(itemId, method);
    
    // likedItemsの更新
    setMyFavoriteIds((prev) => 
      isMyFavorite ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // お気に入り切り替え処理
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

  return (
    <div className="search-results-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">検索結果</h1>
      </div>

      <div className="items-list">
        {results.length > 0 ? (
          results.map(item => (
            <Item
              key={item.ItemID} 
              name={item.User ? item.User.UserName : '不明'} // ユーザー名を渡す
              userIcon={item.User && item.User.Icon ? item.User.Icon : 'default-icon-url.jpg'}
              itemId={item.ItemID} 
              title={item.ItemName} 
              imageSrc={`https://loopplus.mydns.jp/${item.ItemImage}`} // 画像URLを適切に設定
              description={item.Description} 
              onLike={() => handleLike(item.ItemID)} // お気に入りの切り替え
              liked={myFavoriteIds.includes(item.ItemID)} // いいね状態を設定
              time={item.CreatedAt}
              transactionMethods={item.TradeMethod ? [item.TradeMethod] : []}
            />
          ))
        ) : (
          <p className="no-results">該当する結果が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

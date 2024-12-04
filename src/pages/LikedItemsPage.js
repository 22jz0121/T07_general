import React, { useEffect, useState, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import RequestList from '../components/RequestList'; // Corrected path
import Item from '../components/Item';
import '../css/LikedItemsPage.css';

//2024/11/27　なんか適当に
const LikedItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);  
  const [myFavoriteIds, setMyFavoriteIds] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [likedRequests, setLikedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('listing'); // 'listing' or 'request'
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(true);

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
  
    // クリーンアップ関数
    return () => {
      isMounted.current = false; // アンマウント時にフラグを更新
    };
  }, []); // 依存配列は空のまま
  
  // myFavoriteIds に基づいて storedLikedItems を設定
  useEffect(() => {
    if (items.length > 0 && myFavoriteIds.length > 0) {
      const storedLikedItems = items.filter(item => myFavoriteIds.includes(item.ItemID));
      setFavoriteItems(storedLikedItems);
    }
  }, [items, myFavoriteIds]); // items と myFavoriteIds に依存
  

  //お気に入りボタンが押されたときの処理
  const handleLike = (itemId) => {
    console.log('handleLike called with itemId:', itemId);
    const isLiked = likedItems.includes(itemId);
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="liked-items-page">
      {/* Top Navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">いいね一覧</h1>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'listing' ? 'active' : ''}`}
          onClick={() => handleTabClick('listing')}
        >
          出品物一覧
        </button>
        <button
          className={`tab ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => handleTabClick('request')}
        >
          リクエスト
        </button>
      </div>
      {loading ? (
        <div className='loading'>
          <img src='/Loading.gif' alt="Loading"/>
        </div>
      ) : (
        <div className="tab-content">
          {activeTab === 'listing' ? (
            <div>
              {favoriteItems.map(item => (
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
          ) : likedRequests.length > 0 ? (
            <RequestList requests={likedRequests} showPostButton={false} />
          ) : (
            <p className="pp">いいねしたリクエストはありません。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LikedItemsPage;

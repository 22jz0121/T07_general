import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Item from '../components/Item'; // 正しいパスを指定
import '../css/HistoryPage.css'; // 必要に応じて正しいパスを確認

const HistoryPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // すべての取引アイテムを格納
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('myItems'); // タブの状態管理
  const [itemFilter, setItemFilter] = useState('ongoing'); // アイテムフィルタの状態管理
  const [likedItems, setLikedItems] = useState([]); // お気に入りアイテムのIDを格納
  const [myFavoriteIds, setMyFavoriteIds] = useState([]); // ユーザーのお気に入りアイテムのIDを格納

  // ユーザーのID（MyID）をセッションストレージなどから取得
  const myID = sessionStorage.getItem('MyID');

  useEffect(() => {
    let isMounted = true; // マウント状態を管理

    const fetchItems = async () => {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/item`); // すべてのアイテムを取得
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (Array.isArray(data) && isMounted) {
          setItems(data); // 取得したデータを設定
        } else {
          console.error('Unexpected data structure:', data); // デバッグ用
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        if (isMounted) {
          setLoading(false); // ローディングを終了
        }
      }
    };

    fetchItems(); // コンポーネントがマウントされたときにデータを取得

    // クリーンアップ関数
    return () => {
      isMounted = false; // アンマウントされた場合、状態を更新しない
    };
  }, []);

  // お気に入りボタンが押されたときの処理
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

  // ステート管理にselectedTradeFlagを追加
  const [selectedTradeFlag, setSelectedTradeFlag] = useState(1); // 初期値を1（取引中）に設定

  // プルダウンメニューの値変更時に呼び出される関数
  const handleTradeFlagChange = (event) => {
    const value = parseInt(event.target.value, 10); // プルダウンの選択値を取得
    setSelectedTradeFlag(value); // ステートを更新
    setItemFilter(value === 1 ? 'ongoing' : 'completed'); // フィルタを変更
  };

  // フィルタリング部分の修正（「出品中」を削除）
  const filteredItems = items.filter(item => {
    const isOngoing = selectedTradeFlag === 1 && item.TradeFlag === 1; // 取引中
    const isCompleted = selectedTradeFlag === 2 && item.TradeFlag === 2; // 取引完了

    const isOthersItem = item.TraderID === parseInt(myID); // 他人が出品した商品
    const isMyItem = item.UserID === parseInt(myID); // 自分が出品した商品

    if (activeTab === 'others' && isOthersItem) {
      return isOngoing || isCompleted; // 選択された取引状態に一致
    } else if (activeTab === 'myItems' && isMyItem) {
      return isOngoing || isCompleted; // 選択された取引状態に一致
    }
    return false;
  }).sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)); // 新しい順にソート

  return (
    <div className="history-page-container">
      {/* トップナビゲーション */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">取引履歴</h1>
      </div>

      {/* タブバー */}
      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'myItems' ? 'active' : ''}`}
          onClick={() => setActiveTab('myItems')}
        >
          自分の物品
        </button>
        <button
          className={`tab ${activeTab === 'others' ? 'active' : ''}`}
          onClick={() => setActiveTab('others')}
        >
          他人の物品
        </button>
      </div>

      {/* プルダウンメニュー */}
      <div className="pull-container">
        <select id="tradeFlag" value={selectedTradeFlag} onChange={handleTradeFlagChange}>
          <option value={1}>取引中</option>
          <option value={2}>取引完了</option>
        </select>
      </div>

      <div className="transaction-list">
        {loading ? (
          <div className='loading'><img src='/Loading.gif' alt="Loading" /></div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div
              key={item.ItemID}
              onClick={() => navigate(`/listing/${item.ItemID}`)} // 商品ページへ遷移
              style={{ cursor: 'pointer' }}
            >
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
            </div>
          ))
        ) : (
          <p className="no-transactions">
            {activeTab === 'others'
              ? '他人の物品はありません。'
              : '自分の物品はありません。'}
          </p>
        )}
      </div>

    </div>
  );
};

export default HistoryPage;

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

  // 現在のタブとプルダウンの状態に基づいて取引履歴をフィルタリング
  const filteredItems = items.filter(item => {
    const isOngoing = itemFilter === 'ongoing' && item.TradeFlag === 1;
    const isCompleted = itemFilter === 'completed' && item.TradeFlag === 2;

    const isOthersItem = item.TraderID === parseInt(myID); // 他人が出品した商品
    const isMyItem = item.UserID === parseInt(myID); // 自分が出品した商品

    if (activeTab === 'others' && isOthersItem) {
      return isOngoing || isCompleted;
    } else if (activeTab === 'myItems' && isMyItem) {
      return isOngoing || isCompleted;
    }
    return false;
  });

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
      <div className="filter-dropdown">
        <select
          id="item-filter"
          value={itemFilter}
          onChange={(e) => setItemFilter(e.target.value)}
        >
          <option value="ongoing">取引中</option>
          <option value="completed">取引完了</option>
        </select>
      </div>

      <div className="transaction-list">
        {loading ? (
          <p>Loading transactions...</p> // ローディング中の表示
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div
              key={item.ItemID}
              onClick={() => navigate(`/product/${item.ItemID}`)} // 商品ページへ遷移
              style={{ cursor: 'pointer' }}
            >
              <Item
                itemId={item.ItemID}
                name={item.User ? item.User.UserName : '不明'} // ユーザー名を表示（Userがnullの場合は'不明'を表示）
                userIcon={item.User ? item.User.Icon : 'default-icon-url'} // ユーザーアイコンを表示
                createdAt={item.CreatedAt} // 作成日を渡す
                title={item.ItemName} // アイテム名を渡す
                imageSrc={`https://loopplus.mydns.jp/${item.ItemImage}`} // アイテム画像を渡す
                description={item.Description} // 説明を渡す
                transactionMethods={item.TradeMethod ? [item.TradeMethod] : []}
              />
            </div>
          ))
        ) : (
          <p className="no-transactions">
            {activeTab === 'others'
              ? '他人の商品はありません。'
              : '自分の商品はありません。'}
          </p>
        )}
      </div>

    </div>
  );
};

export default HistoryPage;

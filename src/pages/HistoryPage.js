import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Item from '../components/Item'; // 正しいパスを指定
import '../css/HistoryPage.css'; // 必要に応じて正しいパスを確認

function HistoryPage() {
  const navigate = useNavigate();

  // ダミーデータ
  const [transactions] = useState([
    {
      id: 1,
      name: '55インチスマートテレビ',
      timestamp: '1時間前',
      image: 'https://source.unsplash.com/random/300x200?tv',
      description: '最新の4K対応スマートテレビ。',
      location: '12号館',
      transactionMethods: ['譲渡'],
      status: '取引中',
    },
    {
      id: 2,
      name: 'ゲーミングチェア',
      timestamp: '2日前',
      image: 'https://source.unsplash.com/random/300x200?chair',
      description: '快適なゲーム環境を提供するチェア。',
      location: '10号館',
      transactionMethods: ['レンタル'],
      status: '取引完了',
    },
  ]);

  // タブの状態管理
  const [activeTab, setActiveTab] = useState('ongoing');

  // 現在のタブに基づいて取引履歴をフィルタリング
  const filteredTransactions =
    activeTab === 'ongoing'
      ? transactions.filter((transaction) => transaction.status === '取引中')
      : transactions.filter((transaction) => transaction.status === '取引完了');

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
          className={`tab ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          取引中
        </button>
        <button
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          取引完了
        </button>
      </div>

      {/* 取引リスト */}
      <div className="transaction-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              onClick={() => navigate(`/listing/${transaction.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Item
                itemId={transaction.id}
                name={transaction.name}
                time={transaction.timestamp}
                imageSrc={transaction.image}
                title={transaction.name}
                description={transaction.description}
                location={`取引場所：${transaction.location}`}
                transactionMethods={transaction.transactionMethods}
              />
            </div>
          ))
        ) : (
          <p className="no-transactions">
            {activeTab === 'ongoing'
              ? '取引中のアイテムはありません。'
              : '取引完了のアイテムはありません。'}
          </p>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;

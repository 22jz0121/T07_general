import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import RequestList from '../components/RequestList'; // Corrected path
import ItemList from '../components/ItemList'; // Corrected path
import '../css/LikedItemsPage.css';

const LikedItemsPage = () => {
  const navigate = useNavigate();

  const [likedItems, setLikedItems] = useState([]);
  const [likedRequests, setLikedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('listing'); // 'listing' or 'request'

  useEffect(() => {
    // Fallback dummy data
    const dummyLikedItems = [
      {
        id: 1,
        name: '55インチスマートテレビ',
        timestamp: '1時間前',
        image: 'https://source.unsplash.com/random/300x200?tv',
        description: '最新の4K対応スマートテレビ。',
        location: '12号館',
        transactionMethods: ['譲渡'],
      },
      {
        id: 2,
        name: 'ゲーミングチェア',
        timestamp: '2日前',
        image: 'https://source.unsplash.com/random/300x200?chair',
        description: '快適なゲーム環境を提供するチェア。',
        location: '10号館',
        transactionMethods: ['レンタル'],
      },
    ];

    const dummyLikedRequests = [
      {
        id: 1,
        name: '4Kテレビが欲しい',
        time: '5時間前',
        description: '最近引っ越したので、大画面のテレビを探しています。',
        imageSrc: 'https://source.unsplash.com/random/300x200?television',
      },
      {
        id: 2,
        name: 'ノイズキャンセリングイヤホンが欲しい',
        time: '3日前',
        description: 'カフェで集中するために欲しいです。',
        imageSrc: 'https://source.unsplash.com/random/300x200?headphones',
      },
    ];

    // Load from localStorage or fallback to dummy data
    const storedLikedItems = JSON.parse(localStorage.getItem('likedItems')) || dummyLikedItems;
    const storedLikedRequests = JSON.parse(localStorage.getItem('likedRequests')) || dummyLikedRequests;

    setLikedItems(storedLikedItems);
    setLikedRequests(storedLikedRequests);
  }, []);

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

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'listing' ? (
          likedItems.length > 0 ? (
            <ItemList items={likedItems} />
          ) : (
            <p className="pp">いいねした出品物はありません。</p>
          )
        ) : likedRequests.length > 0 ? (
          <RequestList requests={likedRequests} showPostButton={false} />
        ) : (
          <p className="pp">いいねしたリクエストはありません。</p>
        )}
      </div>
    </div>
  );
};

export default LikedItemsPage;

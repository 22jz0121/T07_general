import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, NotificationsNone as NotificationsIcon } from '@mui/icons-material';
import ItemList from './ItemList'; // Import ItemList
import RequestList from './RequestList'; // Import RequestList
import '../css/top.css';

function TopSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('listing');
  const notificationRef = useRef(null);

  // 検索処理
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/searchitem?word=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        // 検索結果が取得できたら、結果画面に遷移
        if (response.ok) {
          navigate('/search-results', {
            state: { results: data }, // APIからの結果を渡す
          });
        } else {
          alert('検索に失敗しました。');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        alert('検索中にエラーが発生しました。');
      }
    } else {
      alert('キーワードを入力してください。');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Enterキーで検索
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Sync active tab based on the current URL path
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('listing');
    } else if (location.pathname === '/request') {
      setActiveTab('request');
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    if (tab === 'listing') {
      navigate('/'); // Navigate to the listing page
    } else if (tab === 'request') {
      navigate('/request'); // Navigate to the request page
    }
    setActiveTab(tab); // Update the active tab
  };

  // 画像クリック時にページの一番上に戻る関数
  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // スムーズにスクロール
    });
  };

  return (
    <header>
      <div className="top-section-wrapper">
        <div className="top-bar">
          <div>
            <img
              src='/logo.png'
              alt="Logo"
              width="90"
              id="logo"
              style={{ cursor: 'pointer' }} // styleをオブジェクト形式に変更
              onClick={handleLogoClick} // クリックイベントを追加
            />
          </div>
          <div className="searchs-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              className="search-box"
              placeholder="欲しいものを探す"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress} // Enterキーで検索
            />
          </div>
        </div>
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
      </div>
      {/* Embed ItemList or RequestList component based on activeTab */}
      {activeTab === 'listing' && <ItemList />}
      {activeTab === 'request' && <RequestList />}
    </header>
  );
}

export default TopSection;

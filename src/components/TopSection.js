import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, NotificationsNone as NotificationsIcon } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import ItemList from './ItemList'; // Import ItemList
import RequestList from './RequestList'; // Import RequestList
import '../css/top.css';

function TopSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: '新しいメッセージが届きました' },
    { id: 2, message: '取引が完了しました' },
    { id: 3, message: 'リクエストが承認されました' }
  ]);
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

  const toggleNotificationBar = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  // 通知を削除する関数
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(notification => notification.id !== id));
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

  return (
    <header>
      <div className="top-section-wrapper">
        <div className="top-bar">
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
          <div className="notification-container" ref={notificationRef}>
            <Badge badgeContent={notifications.length} color="error" overlap="circular">
              <NotificationsIcon className="icon bell-icon" onClick={toggleNotificationBar} />
            </Badge>
            {isNotificationOpen && (
              <div className="notification-bar">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      {notification.message}
                      <button onClick={() => removeNotification(notification.id)} className="remove-button">×</button>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">通知はありません</p>
                )}
              </div>
            )}
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

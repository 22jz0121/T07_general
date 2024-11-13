// src/components/TopSection.js

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, NotificationsNone as NotificationsIcon } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import '../css/top.css';

function TopSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    '新しいメッセージが届きました',
    '取引が完了しました',
    'リクエストが承認されました'
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      navigate('/search-results', { state: { searchQuery, category: '' } });
    }
  };

  // Toggle the notification bar
  const toggleNotificationBar = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  // Close the notification bar if clicking outside of it
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
              onKeyPress={handleKeyPress} // Trigger search on Enter key press
            />
          </div>
          <div className="notification-container" ref={notificationRef}>
            <Badge badgeContent={notifications.length} color="error" overlap="circular">
              <NotificationsIcon className="icon bell-icon" onClick={toggleNotificationBar} />
            </Badge>
            {isNotificationOpen && (
              <div className="notification-bar">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="notification-item">
                      {notification}
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
          <button className="tab" onClick={() => navigate('/')}>出品物一覧</button>
          <button className="tab" onClick={() => navigate('/request')}>リクエスト</button>
        </div>
      </div>
    </header>
  );
}

export default TopSection;

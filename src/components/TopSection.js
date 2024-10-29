import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, NotificationsNone as NotificationsIcon } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import '../css/top.css';

function TopSection() {
  const navigate = useNavigate();
  const notificationCount = 5; // ダミーデータ（通知が来たら数字がたまるようにバックエンド側で設定してほしい）

  return (
    <header>
      <div className="top-section-wrapper">
        <div className="top-bar">
          <div className="search-container">
            <SearchIcon className="search-icon" />
            <input type="text" className="search-box" placeholder="欲しいものを探す" />
          </div>
          <Badge badgeContent={notificationCount} color="error" overlap="circular">
            <NotificationsIcon className="icon bell-icon" />
          </Badge>
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

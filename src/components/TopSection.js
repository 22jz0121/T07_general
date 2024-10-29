import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Search as SearchIcon, NotificationsNone as NotificationsIcon } from '@mui/icons-material'; // Import Material UI icons
import '../css/top.css';

function TopSection() {
  const navigate = useNavigate(); // Initialize the navigation hook

  return (
    <header>
      {/* Wrapper for Top Bar and Tab Bar */}
      <div className="top-section-wrapper">
        {/* Top Bar with Search and Notifications */}
        <div className="top-bar">
          <div className="search-container">
            <SearchIcon className="search-icon" /> {/* Material UI Search Icon */}
            <input type="text" className="search-box" placeholder="欲しいものを探す" />
          </div>
          <NotificationsIcon className="icon bell-icon" /> {/* Material UI Bell Icon */}
        </div>

        {/* Tab Bar with Navigation */}
        <div className="tab-bar">
          <button className="tab" onClick={() => navigate('/')}>出品物一覧</button> {/* Navigate to "/" */}
          <button className="tab" onClick={() => navigate('/request')}>リクエスト</button>
        </div>
      </div>
    </header>
  );
}

export default TopSection;

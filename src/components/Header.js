import React from 'react';
import { Search as SearchIcon, NotificationsNone as NotificationsIcon } from '@mui/icons-material'; // Import Material UI icons
import '../css/top.css';

function Header() {
  return (
    <header>
      <div className="top-bar">
        <div className="search-container">
          <SearchIcon className="search-icon" /> {/* Material UI Search Icon */}
          <input type="text" className="search-box" placeholder="欲しいものを探す" />
        </div>
        <NotificationsIcon className="icon bell-icon" /> {/* Material UI Bell Icon */}
      </div>
    </header>
  );
}

export default Header;

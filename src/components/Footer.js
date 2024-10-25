import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, Upload as CloudUploadIcon, ChatBubbleOutline as MessageIcon, AccountCircle as MyPageIcon } from '@mui/icons-material'; // Import Material UI icons
import '../css/top.css';

function Footer() {
  const navigate = useNavigate(); // Initialize the navigation hook

  return (
    <footer>
      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/')}> {/* Navigate to home */}
          <HomeIcon className="footer-icon" />
          <span className="nav-label">ホーム</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/search')}> {/* Navigate to search */}
          <SearchIcon className="footer-icon" />
          <span className="nav-label">探す</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/upload')}> {/* Navigate to upload */}
          <CloudUploadIcon className="footer-icon" />
          <span className="nav-label">出品</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/messages')}> {/* Navigate to messages */}
          <MessageIcon className="footer-icon" />
          <span className="nav-label">メッセージ</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/mypage')}> {/* Navigate to my page */}
          <MyPageIcon className="footer-icon" />
          <span className="nav-label">マイページ</span>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;

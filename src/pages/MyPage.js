// src/pages/MyPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SchoolIcon from '@mui/icons-material/School';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Footer from '../components/Footer'; // Import your Footer component
import '../css/MyPage.css';

const MyPage = () => {
    const navigate = useNavigate();

    // Function to navigate to the profile page
    const handleProfileClick = () => {
        const currentUserId = '123'; // Replace with actual logged-in user ID from auth system
        navigate(`/profile/${currentUserId}`); // Navigate to the current user's profile page
    };

    return (
        <div className="mypage-container">
            {/* Top Navigation */}
            <div className="top-navigation">
                <button className="back-button" onClick={() => navigate('/')}>
                    <ArrowBackIcon className="back-icon" />
                </button>
                <h1 className="page-title">マイページ</h1>
            </div>

            {/* Profile Section */}
            <div className="profile-section" onClick={handleProfileClick}>
                <AccountCircleIcon className="profile-icon" style={{ fontSize: '36px' }} /> {/* アイコンのサイズを変更 */}
                <span className="profile-name">日本電子</span>
                <ChevronRightIcon className="right-arrow-icon" style={{ fontSize: '20px' }} /> {/* アイコンのサイズを変更 */}
            </div>

            {/* Menu Grid */}
            <div className="menu-grid">
                <div className="menu-item">
                    <FavoriteBorderIcon className="menu-icon" />
                    <span className="menu-label">いいね一覧</span>
                </div>
                <div className="menu-item">
                    <HistoryIcon className="menu-icon" />
                    <span className="menu-label">履歴</span>
                </div>
                <div className="menu-item">
                    <HelpOutlineIcon className="menu-icon" />
                    <span className="menu-label">お問い合わせ</span>
                </div>
                <div className="menu-item">
                    <SchoolIcon className="menu-icon" />
                    <span className="menu-label">学内情報</span>
                </div>
                <div className="menu-item">
                    <QuestionAnswerIcon className="menu-icon" />
                    <span className="menu-label">Q&A</span>
                </div>
                <div className="menu-item">
                    <ExitToAppIcon className="menu-icon" />
                    <span className="menu-label">ログアウト</span>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MyPage;

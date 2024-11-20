import React, { useEffect, useState } from 'react';
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
import Footer from '../components/Footer';
import '../css/MyPage.css';

const MyPage = () => {
    const navigate = useNavigate();
    const currentUserId = '123'; // Replace with actual logged-in user ID
    const [userProfile, setUserProfile] = useState({
        name: '',
        avatar: '',
    });

    // Load user profile on component mount
    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem(`profile-${currentUserId}`));
        if (storedProfile) {
            setUserProfile({
                name: storedProfile.name || 'プロフィールを編集する',
                avatar: storedProfile.avatar || '',
            });
        } else {
            setUserProfile({
                name: 'プロフィールを編集する',
                avatar: '',
            });
        }
    }, [currentUserId]);

    // Navigate to profile page
    const handleProfileClick = () => {
        navigate(`/profile/${currentUserId}`);
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
                {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="User Avatar" className="profile-avatar" />
                ) : (
                    <AccountCircleIcon className="profile-icon" />
                )}
                <span className="profile-name">{userProfile.name}</span>
                <ChevronRightIcon className="right-arrow-icon" />
            </div>

            {/* Menu Grid */}
            <div className="menu-grid">
                <div className="menu-item" onClick={() => navigate('/liked-items')}>
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

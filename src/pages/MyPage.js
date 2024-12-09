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
    const myID = sessionStorage.getItem('MyID');
    const myName = sessionStorage.getItem('MyName');
    const myIcon = sessionStorage.getItem('MyIcon');

    // Navigate to profile page
    const handleProfileClick = () => {
        navigate(`/profile/${myID}`);
    };

    // Redirect to external URL
    const handleSchoolInfoClick = () => {
        window.location.href = 'https://www.jec.ac.jp/school-outline/current-student/';
    };

    // Function to handle logout ログアウト処理追記 NN 12/02

    const handleLogout = () => {
        fetch('https://loopplus.mydns.jp/api/logout', {
            method: 'GET',
            headers: {
                // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                sessionStorage.removeItem('MyID');
                sessionStorage.removeItem('MyName');
                sessionStorage.removeItem('MyIcon');
                sessionStorage.removeItem('MyMail');

                // ログアウト成功時にログインページへ遷移
                navigate('/login');
            } else {
                console.error('ログアウトに失敗しました');
            }
        })
        .catch(error => console.error('エラー:', error));
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
                {myIcon ? (
                    <img src={`https://loopplus.mydns.jp/${myIcon}`} alt="User Avatar" className="profile-avatar" />
                ) : (
                    <AccountCircleIcon className="profile-icon" />
                )}
                <span className="profile-name">{myName}</span>
                <ChevronRightIcon className="right-arrow-icon" />
            </div>

            {/* Menu Grid */}
            <div className="menu-grid">
                <div className="menu-item" onClick={() => navigate('/liked-items')}>
                    <FavoriteBorderIcon className="menu-icon" />
                    <span className="menu-label">いいね一覧</span>
                </div>
                <div className="menu-item" onClick={() => navigate('/history')}>
                    <HistoryIcon className="menu-icon" />
                    <span className="menu-label">履歴</span>
                </div>
                <div className="menu-item" onClick={() => window.location.href = 'https://forms.gle/4fm6jAafJ1APJYo69'}>
                    <HelpOutlineIcon className="menu-icon" />
                    <span className="menu-label">お問い合わせ</span>
                </div>
                <div className="menu-item" onClick={handleSchoolInfoClick}>
                    <SchoolIcon className="menu-icon" />
                    <span className="menu-label">学内情報</span>
                </div>
                <div className="menu-item" onClick={() => navigate('/qa')}>
                    <QuestionAnswerIcon className="menu-icon" />
                    <span className="menu-label">Q&A</span>
                </div>
                <div className="menu-item" onClick={handleLogout}>
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

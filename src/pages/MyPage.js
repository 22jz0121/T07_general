import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SchoolIcon from '@mui/icons-material/School';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import {Notifications as NotificationsIcon} from '@mui/icons-material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import Footer from '../components/Footer';
import '../css/MyPage.css';

const MyPage = () => {
    const navigate = useNavigate();
    const myID= sessionStorage.getItem('MyID');
    const myName = sessionStorage.getItem('MyName');
    const myIcon = sessionStorage.getItem('MyIcon');
    const [NTFstatus, setNotification] = useState(false);
    

    //--------------------------------------------------
    //　　　　　　プロフィールページへ
    //---------------------------------------------------
    const handleProfileClick = () => {
        navigate(`/profile/${myID}`);
    };


    //--------------------------------------------------
    //　　　　　　取引履歴へ・・・！！
    //---------------------------------------------------
    const handleHistoryClick = () => {
        navigate(`/history/${myID}`);
    };


    //--------------------------------------------------
    //　　　　　　学校のホームページへ・・・！！
    //---------------------------------------------------
    // Redirect to external URL
    const handleSchoolInfoClick = () => {
        window.location.href = 'https://www.jec.ac.jp/school-outline/current-student/';
    };


    //--------------------------------------------------
    //　　　　　　プッシュ通知ON/OFF処理
    //---------------------------------------------------
    // プッシュ通知ON/OFF処理
    const changeNotification = async () => {
        const currentStatus = localStorage.getItem('Notification') === 'enable';
        const msg = currentStatus 
            ? '現在、プッシュ通知はONになっています。\r\nOFFにしますか？'
            : '現在、プッシュ通知はOFFになっています。\r\nONにしますか？';

        const result = window.confirm(msg);
        if (result) {
            const newStatus = !currentStatus; // 新しいステータスを決定
            setNotification(newStatus);
            localStorage.setItem('Notification', newStatus ? 'enable' : 'disable');

            if (newStatus) {
                await getPushSubscription();
            } else {
                await deleteSubscription();
            }
        }
    };

    // 状態が変わったときに実行される
    useEffect(() => {
        setNotification(localStorage.getItem('Notification') === 'enable');
    }, []);



    //--------------------------------------------------
    //　　　　　　プッシュ通知を使えるか判定
    //---------------------------------------------------
    const getPushSubscription = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            alert('このブラウザはプッシュ通知に対応していません');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'denied' || permission === 'default') {
            alert('プッシュ通知が許可されていません。ブラウザの設定を変更してください');
            return;
        }

        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.REACT_APP_WEB_PUSH_VAPID_PUBLIC_KEY,
        });

        await saveSubscription(subscription); // サブスクリプションを保存
        console.log('サブスクリプションが保存されました！');
    };



    //--------------------------------------------------
    //　　　　　　プッシュ通知のための情報を保存
    //---------------------------------------------------
    const saveSubscription = async (subscription) => {
        try {
            const response = await fetch('https://loopplus.mydns.jp/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    keys: subscription.toJSON().keys,
                    user_id: myID, // ユーザーIDを追加
                }),
            });

            const data = await response.json();
            if (!data.success) {
                alert('サブスクリプションの保存に失敗しました。');
            }
        } catch (error) {
            console.error('エラー:', error);
            alert('エラーが発生しました。');
        }
    };


    //--------------------------------------------------
    //　　　　　　プッシュ通知のための情報を削除
    //---------------------------------------------------
    const deleteSubscription = async () => {
        try {
            const response = await fetch('https://loopplus.mydns.jp/api/deletesubscribe', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (!data.success) {
                alert('サブスクリプションの削除に失敗しました。');
            }
        } catch (error) {
            console.error('エラー:', error);
            alert('エラーが発生しました。');
        }
    };

    //--------------------------------------------------
    //　　　　　　ログアウト処理
    //---------------------------------------------------
    const handleLogout = () => {
        fetch('https://loopplus.mydns.jp/api/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                sessionStorage.clear(); // Clear all session storage
                navigate('/login');
            } else {
                console.error('ログアウトに失敗しました');
            }
        })
        .catch(error => console.error('エラー:', error));
    };

    const iconSrc = myIcon && myIcon.startsWith('storage/images/')
        ? `https://loopplus.mydns.jp/${myIcon}`
        : myIcon;

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
                    <img src={iconSrc} alt="User Avatar" className="profile-avatar" />
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
                <div className="menu-item" onClick={handleHistoryClick}>
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

                <div className="menu-item" onClick={changeNotification}>
                    {NTFstatus === true ? <NotificationsIcon className="menu-icon" /> : <NotificationsOffIcon className="menu-icon" />}
                    <span className="menu-label">プッシュ通知</span>
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

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/GoogleCallback.css';

function GoogleCallback({ setIsFooterVisible }) {
  const navigate = useNavigate();
  const location = useLocation();

  // URLのクエリパラメータを取得
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  useEffect(() => {
    // フッターを非表示にする
    setIsFooterVisible(false);

    // スクロールを禁止
    document.body.style.overflow = 'hidden';

    const fetchMyinfo = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/api/whoami', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          sessionStorage.setItem('MyID', data.UserID);
          sessionStorage.setItem('MyName', data.Username);
          sessionStorage.setItem('MyIcon', data.Icon);
          sessionStorage.setItem('MyMail', data.Email);
          sessionStorage.setItem('MyComment', data.Comment);
          sessionStorage.setItem('MyProfPic', data.ProfilePicture);
          if(localStorage.getItem('Notification')) {
            sessionStorage.setItem('Notification', 'enable');
          }
          else {
            sessionStorage.setItem('Notification', 'disable');
          }
          if (status == 'admin') {
            sessionStorage.setItem('admin', data.AdminFlag);
            window.location.href = "https://loopplus.mydns.jp/admin"
          } else {
            navigate('/'); // 一般ユーザー用のページへナビゲート
          }
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchMyinfo();

    // クリーンアップ関数でフッターを再表示し、スクロールを再度有効にする
    return () => {
      setIsFooterVisible(true);
      document.body.style.overflow = 'auto'; // スクロールを再度有効にする
    };
  }, [navigate, setIsFooterVisible]);

  return (
    <div className="google-callback-container">
      <img src='/logo.png' alt="Logo" width="100" id="logos" />
      <h1>LOOP+へようこそ</h1>
    </div>
  );
}

export default GoogleCallback;

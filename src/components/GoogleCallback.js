import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/GoogleCallback.css'

function GoogleCallback({ setIsFooterVisible }) {
  const navigate = useNavigate();

  useEffect(() => {
    // フッターを非表示にする
    setIsFooterVisible(false);

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
          navigate('/');  // ログイン後のページへリダイレクト
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchMyinfo();

    // クリーンアップ関数でフッターを再表示
    return () => setIsFooterVisible(true);
  }, [navigate, setIsFooterVisible]);

  return (
    <div className="google-callback-container">
      <img src='/logo.png' alt="Logo" width="100" id="logo" />
      <h1>LOOP+へようこそ</h1>
    </div>
  );
}

export default GoogleCallback;

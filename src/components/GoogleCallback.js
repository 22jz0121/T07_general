import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 自分のUserIDを取得する関数
    const fetchMyinfo = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/api/whoami', {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }); // ログイン状態を確認するエンドポイント

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('MyID', data.UserID);
          localStorage.setItem('MyName', data.Username);
          localStorage.setItem('MyIcon', data.Icon);
          localStorage.setItem('MyMail', data.Email);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchMyinfo();
    navigate('/');  // ログイン後のページへリダイレクト
  }, [navigate]);

  return <div>LOOP+へようこそ</div>;
}

export default GoogleCallback;

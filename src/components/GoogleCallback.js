import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
          localStorage.setItem('MyID', data.UserID);
          localStorage.setItem('MyName', data.Username);
          localStorage.setItem('MyIcon', data.Icon);
          localStorage.setItem('MyMail', data.Email);
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

  return <div>LOOP+へようこそ</div>;
}

export default GoogleCallback;

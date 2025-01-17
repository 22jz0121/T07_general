import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../css/search.css'; 

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]); // ステートを初期化
  const [loading, setLoading] = useState(true); // ローディング状態を管理
  const myUserID= sessionStorage.getItem('MyID');

  useEffect(() => {
    // 特定のアナウンスメントを取得する関数
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/announcements/${myUserID}`);
        if (!response.ok) {
          throw new Error('ネットワークエラー');
        }
        const data = await response.json();
        
        setNotifications(data); // フィルタリングしたデータをステートに保存
      } catch (error) {
        console.error('エラー:', error);
      } finally {
        setLoading(false); // ローディングを終了
      }
    };

    fetchAnnouncements(); // 関数を呼び出す
  }, []); // 空の依存配列でコンポーネントのマウント時に実行


  const formattedContent = (content) => {
    return content.split('\n').map((item, index) => (
      <React.Fragment key={index}>
        {item}
        {index < content.split('\n').length - 1 && <br/>}
      </React.Fragment>
    ));
  };
  return (
    <div className="notifications-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">通知</h1>
      </div>

      <div className='notifications-div'>
        <div className="notifications-list">
          {loading ? ( // ローディング中の表示
            <div className="loading"><img src="/Loading.gif" alt="Loading" /></div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.AnnounceID} 
                className={`notification-item ${notification.WarnFlag === 1 ? 'warning' : ''}`}
              >
                <p className="notification-message">{formattedContent(notification.Content)}</p>
                <span className="notification-date">{new Date(notification.CreatedAt).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="no-notifications">通知はありません。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

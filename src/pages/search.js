import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../css/search.css'; // 新しいCSSファイルを作成

const Notifications = () => {
  const navigate = useNavigate();

  // サンプルの通知データ
  const notifications = [
    { id: 1, message: '新しいメッセージがあります。', date: '2025-01-14' },
    { id: 2, message: 'システムメンテナンスのお知らせ。', date: '2025-01-13' },
    { id: 3, message: '新しい機能が追加されました。', date: '2025-01-12' },
  ];

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
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">{notification.date}</span>
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

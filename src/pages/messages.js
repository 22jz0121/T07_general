import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PullToRefresh from "react-simple-pull-to-refresh";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const [myChats, setMyChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyChats = async () => {
    try {
      const response = await fetch('https://loopplus.mydns.jp/api/mychat', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched chats:', data);
      return data;
    } catch (error) {
      console.error('Error fetching my chats:', error);
      setError('チャットの取得に失敗しました。');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMyChats();
      // Sort chats by LastContent.CreatedAt in descending order
      const sortedChats = data.sort((a, b) => {
        const dateA = new Date(a.LastContent?.CreatedAt || 0);
        const dateB = new Date(b.LastContent?.CreatedAt || 0);
        return dateB - dateA; // Descending order
      });
      setMyChats(sortedChats);
    };

    fetchData();
  }, []);

  const handleItemClick = (id, name, item, otherUserId) => {
    console.log(item);
    navigate(`/dm/${id}`, {
      state: { name, item, otherUserId },
    });
  };

  const formatDateMessage = (createdAt) => {
    const date = new Date(createdAt);
    const today = new Date();

    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
  };

  //ロード中
  if (loading) {
    return (
      <div className="message-list">
        <div className="top-navigation">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowBackIcon className="back-icon" />
          </button>
          <h1 className="page-title">メッセージ</h1>
        </div>
        <div className='loading'><img src='/Loading.gif' alt="Loading" /></div>
      </div>
      
    );
  }


  return (
    <div className="message-list">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">メッセージ</h1>
      </div>
      <PullToRefresh onRefresh={fetchMyChats} pullingContent={<></>}>
        <div className="messages-list">
          {error ? (
            <p className="error-message">{error}</p>
          ) : myChats.length > 0 ? (
            myChats.map((chat) => {
              const iconSrc =
                chat.OtherUser.Icon && chat.OtherUser.Icon.startsWith('storage/images/')
                  ? `https://loopplus.mydns.jp/${chat.OtherUser.Icon}`
                  : chat.OtherUser.Icon;

              return (
                <div
                  key={chat.ChatID}
                  className="message-item"
                  onClick={() => {
                    if (chat.Items) {
                      handleItemClick(
                        chat.ChatID,
                        chat.OtherUser.UserName,
                        chat.Items,
                        chat.OtherUser.UserID
                      );
                    } else {
                      handleItemClick(
                        chat.ChatID,
                        chat.OtherUser.UserName,
                        null,
                        null,
                        null,
                        chat.OtherUser.UserID
                      );
                    }
                  }}
                >
                  {chat.OtherUser.Icon ? (
                    <img
                      src={iconSrc}
                      alt="User Icon"
                      className="avatar-icon"
                      style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                    />
                  ) : (
                    <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
                  )}
                  <div className="message-info">
                    <div className="message-header">
                      <span className="names">{chat.OtherUser.UserName}</span>
                      <span className="time">
                        {chat.LastContent ? formatDateMessage(chat.LastContent.CreatedAt) : '-- : --'}
                      </span>
                    </div>
                    <p className="message-content">
                      {chat.LastContent?.Image
                        ? '画像が送信されました'
                        : chat.LastContent?.Content
                        ? chat.LastContent.Content.length > 16
                          ? `${chat.LastContent.Content.slice(0, 16)}…`
                          : chat.LastContent.Content
                        : 'メッセージがありません'}
                    </p>
                  </div>
                  <span className="arrow">›</span>
                </div>
              );
            })
          ) : (
            <p className="no-transactions">チャットがありません。</p>
          )}
        </div>
      </PullToRefresh>
    </div>
  );
};

export default Messages;

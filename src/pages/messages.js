
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('https://loopplus.mydns.jp/api/mychat',{
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched chats:', data);
      return data;
    }
    catch (error) {
      console.error('Error fetching my chats:', error);
      setError('チャットの取得に失敗しました。');
      return [];
    }
    finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMyChats();
      setMyChats(data);
    };

    fetchData();
  }, []);

  const handleItemClick = (id, name, itemId, hostUserId, itemName) => {
    navigate(`/dm/${id}`, { state: { name, itemId, hostUserId, itemName } });
  };

  return (
      <div className="message-list">
          <div className="top-navigation">
              <button className="back-button" onClick={() => navigate('/')}>
                  <ArrowBackIcon className="back-icon" />
              </button>
              <h1 className="page-title">メッセージ</h1>
          </div>

          {loading ? (
              <div className='loading'>
                  <img src='/Loading.gif' alt="Loading" />
              </div>
          ) : (
              <div className='messages-list'>
                  {error ? (
                      <p className="error-message">{error}</p>
                  ) : myChats.length > 0 ? (
                      myChats.map((chat) => {
                          const iconSrc = chat.OtherUser.Icon && chat.OtherUser.Icon.startsWith('storage/images/') 
                              ? `https://loopplus.mydns.jp/${chat.OtherUser.Icon}` 
                              : chat.OtherUser.Icon;

                          return (
                              <div
                                  key={chat.ChatID}
                                  className="message-item"
                                  onClick={() => handleItemClick(chat.ChatID, chat.OtherUser.UserName, chat.Item.ItemID, chat.Item.UserID, chat.Item.ItemName)}
                              >
                                  {chat.OtherUser.Icon ? (
                                      <img src={iconSrc} alt="User Icon" className="avatar-icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                  ) : (
                                      <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
                                  )}
                                  <div className="message-info">
                                      <div className="message-header">
                                          <span className="names">{chat.OtherUser.UserName}</span>
                                          <span className="time">{new Date(chat.lastMessage?.CreatedAt).toLocaleString()}</span>
                                      </div>
                                      <p className="message-content">{chat.LastContent?.Image 
                                          ? '画像が送信されました' 
                                          : chat.LastContent?.Content 
                                              ? chat.LastContent.Content 
                                              : 'メッセージがありません'}
                                      </p>
                                  </div>
                                  <span className="arrow">›</span>
                              </div>
                          );
                      })
                  ) : (
                      <p>チャットがありません。</p>
                  )}
              </div>
          )}
      </div>
  );

  
};
  
export default Messages;



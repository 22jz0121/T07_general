
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/messages.css';


const Messages = () => {
  const navigate = useNavigate();
  const [myChats, setMyChats] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // ログイン状態を管理

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('https://loopplus.mydns.jp/api/whoami' ,{
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }); // ログイン状態を確認するエンドポイント
      if (!response.ok) {
        throw new Error('ユーザーがログインしていません');
      }
      const data = await response.json();
      console.log('User Info:', data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
      setError('ログインが必要です。'); // エラーメッセージを設定
    }
  };

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
    } catch (error) {
      console.error('Error fetching my chats:', error);
      setError('チャットの取得に失敗しました。');
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkLoginStatus(); // ログイン状態を確認
      if (isLoggedIn) {
        const data = await fetchMyChats();
        setMyChats(data);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const handleItemClick = (id) => {
    navigate(`/dm/${id}`);//chatをdmに変更

  }

// Helper function to truncate message at 25 characters and append "..."
const truncateMessage = (message) => {
  if (message.length > 25) {
    return message.slice(0, 25) + '...';
  }
  return message;
};

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(savedMessages);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const handleItemClick = (id) => {
    navigate(`/dm/${id}`);

  };
}
  return (
    <div className="message-list">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">自分のチャット一覧</h1>
      </div>

      <div className='messages-list'>
        {error ? (
          <p className="error-message">{error}</p>
        ) : myChats.length > 0 ? (
          myChats.map((chat) => (
            <div
              key={chat.ChatID}
              className="message-item"
              onClick={() => handleItemClick(chat.ChatID)}
            >
              <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
              <div className="message-info">
                <div className="message-header">
                  <span className="names">{chat.UserName}</span>
                  <span className="time">{new Date(chat.lastMessage?.CreatedAt).toLocaleString()}</span> {/* 最後のメッセージの日時 */}
                </div>
                <p className="message-content">{chat.LastContent?.Image 
                  ? '画像が送信されました' 
                  : chat.LastContent?.Content 
                    ? chat.LastContent.Content 
                    : 'メッセージがありません'}
                </p> {/* 最後のメッセージ内容 */}
              </div>
              <span className="arrow">›</span>
            </div>
          ))
        ) : (
          <p>チャットがありません。</p>
        )}
      </div>
    </div>
  );
};
  
export default Messages;



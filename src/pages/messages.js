import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Import Arrow Back icon from Material UI
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  // Import AccountCircle for avatars
import '../css/messages.css'; // Import your CSS for styling

const messages = [
  {
    id: 1,
    name: '日本電子',
    message: '初めまして！リクエストありがとうございます。高度情報処理科の電子太郎です。',
    time: '1:20 PM'
  },
  {
    id: 2,
    name: '電子太郎',
    message: '初めまして！リクエストありがとうございます。高度情報処理科の電子太郎です。',
    time: '11:44 AM'
  },
  {
    id: 3,
    name: '電子次郎',
    message: '初めまして！リクエストありがとうございます。高度情報処理科の電子太郎です。',
    time: '11:24 AM'
  },
  {
    id: 4,
    name: '菅原大翼',
    message: '初めまして！リクエストありがとうございます。高度情報処理科の電子太郎です。',
    time: '8:14 AM'
  },
  {
    id: 5,
    name: 'マサトシ',
    message: '初めまして！リクエストありがとうございます。高度情報処理科の電子太郎です。',
    time: '11:30 PM'
  }
];

// Helper function to truncate message at 25 characters and append "..."
const truncateMessage = (message) => {
  if (message.length > 25) {
    return message.slice(0, 25) + '...';
  }
  return message;
};

const Messages = () => {
  const navigate = useNavigate();  // Initialize the navigation hook

  const handleItemClick = (id) => {
    navigate(`/dm/${id}`); // Navigate to DM page for each user by ID
  };

  return (
    <div className="message-list">
      {/* Top Navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}> {/* Navigate to "/" on click */}
          <ArrowBackIcon className="back-icon" /> {/* Use Material UI ArrowBackIcon */}
        </button>
        <h1 className="page-title">メッセージ一覧</h1>
      </div>

      {/* Messages List */}
      <div className='messages-list'>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="message-item" 
            onClick={() => handleItemClick(msg.id)}
          >
            <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} /> {/* Use Material UI Icon instead of image */}
            <div className="message-info">
              <div className="message-header">
                <span className="names">{msg.name}</span>
                <span className="time">{msg.time}</span>
              </div>
              <p className="message-content">{truncateMessage(msg.message)}</p>
            </div>
            <span className="arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/messages.css';

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

  return (
    <div className="message-list">
      {/* Top Navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowBackIcon className="back-icon" />
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
            <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
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

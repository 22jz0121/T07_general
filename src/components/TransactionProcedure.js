import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import tvImage from '../img/tv-image.png';
import '../css/TransactionProcedure.css';

function TransactionProcedure() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      const initialMessage = {
        id: Date.now(),
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }),
        date: new Date(),
      };

      // Save message to localStorage with a specific key for the user (e.g., dm-user-1)
      const conversationId = 'dm-user-1';
      const existingMessages = JSON.parse(localStorage.getItem(`dm-messages-${conversationId}`)) || [];
      const updatedMessages = [...existingMessages, initialMessage];

      // Store the updated messages in localStorage
      localStorage.setItem(`dm-messages-${conversationId}`, JSON.stringify(updatedMessages));

      setMessage(''); // Clear the input field
      navigate(`/dm/${conversationId}`); // Navigate to DirectMessage page for the conversation
    }
  };

  return (
    <div className="transaction-procedure-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">取引手続き</h1>
      </div>

      <div className="transaction-procedure-listing-info">
        <img src={tvImage} alt="Listing" className="transaction-procedure-listing-image" />
        <div className="transaction-procedure-listing-details">
          <h2 className="transaction-procedure-item-title">55インチのスマートテレビ</h2>
          <span className="badge">譲渡</span>
          <p className="transaction-procedure-location">受け渡し場所：12号館</p>
        </div>
      </div>

      <textarea
        className="transaction-procedure-message-input"
        placeholder="出品者へのメッセージを入力してください"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="transaction-procedure-send-message-button" onClick={handleSendMessage}>
        メッセージを送信する！
      </button>
    </div>
  );
}

export default TransactionProcedure;

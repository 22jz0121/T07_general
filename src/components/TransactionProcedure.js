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

      const itemId = 1; // Replace with the actual item ID
      const conversationId = `dm-user-${itemId}`;
      
      // Save the message to localStorage
      const existingMessages = JSON.parse(localStorage.getItem(`dm-messages-${conversationId}`)) || [];
      const updatedMessages = [...existingMessages, initialMessage];
      localStorage.setItem(`dm-messages-${conversationId}`, JSON.stringify(updatedMessages));

      // Save the latest message for the DM summary
      const summaryMessages = JSON.parse(localStorage.getItem('messages')) || [];
      const summaryIndex = summaryMessages.findIndex((msg) => msg.id === conversationId);

      const summaryMessage = {
        id: conversationId,
        name: '日本電子', // Update appropriately
        message: message,
        time: initialMessage.time,
      };

      if (summaryIndex > -1) {
        summaryMessages[summaryIndex] = summaryMessage;
      } else {
        summaryMessages.push(summaryMessage);
      }
      localStorage.setItem('messages', JSON.stringify(summaryMessages));

      // Mark the item as "取引中" in localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const transactionIndex = transactions.findIndex((item) => item.id === itemId);

      const transactionItem = {
        id: itemId,
        name: '55インチのスマートテレビ',
        status: '取引中', // Ongoing transaction
        description: '最新の4K対応スマートテレビ。',
        image: 'https://source.unsplash.com/random/300x200?tv', // Update dynamically if needed
        timestamp: new Date().toLocaleString(),
      };

      if (transactionIndex > -1) {
        transactions[transactionIndex] = transactionItem;
      } else {
        transactions.push(transactionItem);
      }

      localStorage.setItem('transactions', JSON.stringify(transactions));

      setMessage(''); // Clear the input field
      navigate(`/dm/${conversationId}`); // Navigate to DirectMessage page
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

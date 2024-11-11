import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Add as AddIcon, Send as SendIcon } from '@mui/icons-material';
import '../css/directMessage.css';

function DirectMessage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`dm-messages-${id}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const messagesEndRef = useRef(null);

  const [transactionStatus, setTransactionStatus] = useState(() => {
    return JSON.parse(localStorage.getItem(`transaction-status-${id}`)) || 'none';
  });
  const [isSeller, setIsSeller] = useState(false); // For seller role check

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await fetch('/api/user-role', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      const data = await response.json();
      setIsSeller(data.isSeller);
    };

    fetchUserRole();
  }, []);

  const longPressTimeoutRef = useRef(null);
  const LONG_PRESS_DURATION = 700;

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    const isToday = today.toDateString() === messageDate.toDateString();
    const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === messageDate.toDateString();

    if (isToday) return '今日';
    if (isYesterday) return '昨日';
    return messageDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`dm-messages-${id}`, JSON.stringify(messages));
    localStorage.setItem(`transaction-status-${id}`, JSON.stringify(transactionStatus));
  }, [messages, id, transactionStatus]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage = { text: inputValue, recipient_id: id };
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(newMessage)
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setMessages([...messages, { ...savedMessage, sender: 'user', time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }) }]);
        setInputValue('');
      }
    }
  };

  const handleSetDelivery = () => {
    if (transactionStatus === 'none') {
      const confirmation = window.confirm('受け渡し予定者に設定しますか？');
      if (confirmation) {
        setTransactionStatus('deliverySet');
      }
    }
  };

  const handleCancelTransaction = () => {
    const confirmation = window.confirm('取引を中断しますか？');
    if (confirmation) {
      setTransactionStatus('canceled');
    }
  };

  const handleCompleteTransaction = () => {
    const confirmation = window.confirm('取引を完了しますか？');
    if (confirmation) {
      setTransactionStatus('completed');
    }
  };

  return (
    <div className="dm-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/messages')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">ユーザーID: {id}</h1>
      </div>

      {!isSeller && transactionStatus === 'none' && (
        <div className="set-delivery-container fixed">
          <button className="set-delivery-button" onClick={handleSetDelivery}>
            受け渡し予定者に設定
          </button>
        </div>
      )}
      {!isSeller && transactionStatus === 'deliverySet' && (
        <div className="transaction-buttons fixed">
          <button className="cancel-transaction-button" onClick={handleCancelTransaction}>
            取引中断
          </button>
          <button className="complete-transaction-button" onClick={handleCompleteTransaction}>
            取引完了
          </button>
        </div>
      )}

      <div className="dm-messages">
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {index === 0 || formatDate(messages[index - 1].date) !== formatDate(msg.date) ? (
              <div className="talk date">
                <p>{formatDate(msg.date)}</p>
              </div>
            ) : null}
            <div className={`message-container ${msg.sender === 'user' ? 'user' : msg.sender === 'system' ? 'system' : 'other'}`}>
              <div className={`message-bubble ${msg.sender}`}>
                <p className="message-text">{msg.text}</p>
              </div>
              {msg.sender !== 'system' && <span className="message-time">{msg.time}</span>}
            </div>
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="dm-input">
        <button className="image-upload-button">
          <AddIcon className="add-icon" />
        </button>
        <input
          type="text"
          placeholder="メッセージを入力..."
          className="input-box"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          <SendIcon className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default DirectMessage;

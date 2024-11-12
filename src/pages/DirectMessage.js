import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Add as AddIcon, Send as SendIcon } from '@mui/icons-material';
import '../css/directMessage.css';

function DirectMessage() {
  const navigate = useNavigate();
  const { id } = useParams(); // id represents the conversation ID
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`dm-messages-${id}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const messagesEndRef = useRef(null);

  // Flag to indicate if the current user is the seller
  const isSeller = false; // Replace this with actual logic to determine if the user is the seller

  const [transactionStatus, setTransactionStatus] = useState(() => {
    return JSON.parse(localStorage.getItem(`transaction-status-${id}`)) || 'none';
  });

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

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const time = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
      const newMessage = { id: Date.now(), sender: 'user', text: inputValue, time, date: new Date() };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  const isWithinUnsendLimit = (messageDate) => {
    const now = new Date();
    const sentDate = new Date(messageDate);
    const timeDifference = now - sentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    return hoursDifference <= 24;
  };

  const handleLongPress = (index) => {
    const message = messages[index];
    if (message.sender === 'system') {
      if (window.confirm('このシステムメッセージを削除しますか？')) {
        handleDeleteMessage(index);
      }
    } else if (message.sender === 'user') {
      const options = ['削除'];
      if (isWithinUnsendLimit(message.date)) options.unshift('送信取消');

      const selectedOption = window.confirm(options.join(' / '));
      if (selectedOption) {
        if (options[0] === '送信取消' && isWithinUnsendLimit(message.date)) {
          handleUnsendMessage(index);
        } else {
          handleDeleteMessage(index);
        }
      }
    }
  };

  const handlePressEnd = () => clearTimeout(longPressTimeoutRef.current);

  const handleUnsendMessage = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index] = {
      ...messages[index],
      text: 'あなたがメッセージを取り消しました',
      sender: 'system',
    };
    setMessages(updatedMessages);
  };

  const handleDeleteMessage = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
  };

  const handleSetDelivery = () => {
    if (transactionStatus === 'none') {
      const confirmation = window.confirm('受け渡し予定者に設定しますか？');
      if (confirmation) {
        const systemMessage = { sender: 'system', text: '受け渡し予定者に設定されました', time: '', date: new Date() };
        setMessages([...messages, systemMessage]);
        setTransactionStatus('deliverySet');
      }
    }
  };

  const handleCancelTransaction = () => {
    const confirmation = window.confirm('取引を中断しますか？');
    if (confirmation) {
      const systemMessage = { sender: 'system', text: '取引が中断されました', time: '', date: new Date() };
      setMessages([...messages, systemMessage]);
      setTransactionStatus('canceled');
    }
  };

  const handleCompleteTransaction = () => {
    const confirmation = window.confirm('取引を完了しますか？');
    if (confirmation) {
      const systemMessage = { sender: 'system', text: '取引が完了しました', time: '', date: new Date() };
      setMessages([...messages, systemMessage]);
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

      {isSeller && transactionStatus === 'none' ? (
        <div className="set-delivery-container fixed">
          <button className="set-delivery-button" onClick={handleSetDelivery}>
            受け渡し予定者に設定
          </button>
        </div>
      ) : (
        isSeller && transactionStatus === 'deliverySet' && (
          <div className="transaction-buttons fixed">
            <button className="cancel-transaction-button" onClick={handleCancelTransaction}>
              取引中断
            </button>
            <button className="complete-transaction-button" onClick={handleCompleteTransaction}>
              取引完了
            </button>
          </div>
        )
      )}

      <div className="dm-messages">
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {index === 0 || formatDate(messages[index - 1].date) !== formatDate(msg.date) ? (
              <div className="talk date">
                <p>{formatDate(msg.date)}</p>
              </div>
            ) : null}
            <div
              className={`message-container ${msg.sender === 'user' ? 'user' : msg.sender === 'system' ? 'system' : 'other'}`}
              onMouseDown={() => longPressTimeoutRef.current = setTimeout(() => handleLongPress(index), LONG_PRESS_DURATION)}
              onMouseUp={handlePressEnd}
              onTouchStart={() => longPressTimeoutRef.current = setTimeout(() => handleLongPress(index), LONG_PRESS_DURATION)}
              onTouchEnd={handlePressEnd}
            >
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

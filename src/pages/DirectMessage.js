import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Add as AddIcon, Send as SendIcon } from '@mui/icons-material';
import '../css/directMessage.css';

const messages = [
  { sender: 'other', text: 'こんにちは！よろしくお願いします。 あああああああああああああああああああああああああああああああああああああああああああああああああああ', time: '1:20 PM' },
  { sender: 'user', text: 'はい、よろしくお願いします！', time: '1:22 PM' },
  { sender: 'other', text: 'この件について教えてもらえますか？', time: '1:23 PM' },
  { sender: 'user', text: 'もちろんです。まず、...', time: '1:25 PM' },
];

function DirectMessage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      console.log('Message sent:', inputValue);
      setInputValue('');
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

      <div className="dm-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.sender === 'user' ? 'user' : 'other'}`}
          >
            <p className="message-text">{msg.text}</p>
            <span className="message-time">{msg.time}</span>
          </div>
        ))}
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

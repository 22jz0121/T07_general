import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Add as AddIcon, Send as SendIcon } from '@mui/icons-material';
import Pusher from 'pusher-js';
import '../css/directMessage.css';

const DirectMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { name } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef(null);
  const userId = localStorage.getItem('MyID');

  useEffect(() => {
    const pusher = new Pusher('f155afe9e8a09487d9ea', {
      cluster: 'ap3',
    });

    const channel = pusher.subscribe(`chat-room-${id}`);
    channel.bind('message-sent', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    channel.bind('message-deleted', (data) => {
      setMessages((prevMessages) => prevMessages.filter(msg => msg.ChatContentID !== data.ChatContentID));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id]);

  const fetchChatMessages = async () => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/chat/room/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() || imageFile) {
      setIsSending(true);
      const formData = new FormData();
      formData.append('Content', inputValue);
      formData.append('ChatID', id);
      if (imageFile) {
        formData.append('Image', imageFile);
      }

      try {
        const response = await fetch('https://loopplus.mydns.jp/api/chat/send', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (response.ok) {
          setInputValue('');
          setImageFile(null);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleLongPress = (chatContentID) => {
    const confirmDelete = window.confirm('このメッセージを削除しますか？');
    if (confirmDelete) {
      deleteMessage(chatContentID);
    }
  };

  const deleteMessage = async (chatContentID) => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/chat/delete/${chatContentID}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        // Pusherを使って削除イベントをトリガー
        const data = { ChatContentID: chatContentID };
        const pusherResponse = await fetch('https://loopplus.mydns.jp/api/chat/pusher/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include',
        });

        if (!pusherResponse.ok) {
          console.error('Pusher delete event failed');
        }
      } else {
        console.error('メッセージ削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const openFileDialog = () => {
    document.getElementById('image-upload').click();
  };

  return (
    <div className="dm-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/messages')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">{name}</h1>
      </div>

      <div className="dm-messages">
        {messages.map((msg) => {
          const formattedTime = new Date(msg.CreatedAt).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          return (
            <div
              key={msg.ChatContentID}
              className={`message-wrapper ${msg.UserID == userId ? 'right' : 'left'}`}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(msg.ChatContentID);
              }}
            >
              <div className="message-bubble">
                <p className="message-text">{msg.Content}</p>
                {msg.Image && (
                  <img
                    src={`https://loopplus.mydns.jp/${msg.Image}`}
                    alt="メッセージ画像"
                    className="message-image"
                  />
                )}
              </div>
              <div className="span-time">
                <span className="message-time">{formattedTime}</span>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className="dm-input">
        <button className="image-upload-button" onClick={openFileDialog}>
          <AddIcon className="add-icon" />
        </button>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
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
          disabled={!inputValue.trim() && !imageFile || isSending}
        >
          <SendIcon className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default DirectMessage;

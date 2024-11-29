import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Add as AddIcon, Send as SendIcon } from '@mui/icons-material';
import '../css/directMessage.css';

//comit Numasawa 24/11/26

const DirectMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // URLからチャットIDを取得
  const { name } = location.state || {}; // 状態を取得
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState(null); // 画像ファイルの状態を追加
  const [userId, setUserId] = useState(null); // 自分のUserIDを保存する状態を追加
  

  // 自分のUserIDを取得する関数 11/27
  const fetchMyUserId = async () => {
    try {
      const response = await fetch('https://loopplus.mydns.jp/api/whoami' ,{
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }); // ログイン状態を確認するエンドポイント

      if (response.ok) {
        const data = await response.json();
        setUserId(data.UserID); // 自分のUserIDを保存
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };
  
  // チャットメッセージを取得する関数
  const fetchChatMessages = async () => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/chat/room/${id}`); // チャットIDに基づいてメッセージを取得
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data); // 取得したメッセージを状態に保存
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  useEffect(() => {
    fetchMyUserId(); // 自分のUserIDを取得
    fetchChatMessages(); // チャットメッセージを取得する関数を実行
  }, [id]); // チャットIDが変更されたときに再取得

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // 入力値を更新
  };

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]); // 画像ファイルを状態に保存
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() || imageFile) { // メッセージまたは画像がある場合に送信
      const formData = new FormData();
      formData.append('Content', inputValue);
      formData.append('ChatID', id); // チャットIDを送信
      if (imageFile) {
        formData.append('Image', imageFile); // 画像ファイルを送信
      }

      try {
        const response = await fetch('https://loopplus.mydns.jp/api/chat/send', {
          method: 'POST',
          body: formData, // FormDataを使用
          credentials: 'include', // クッキーを含める
        });

        if (response.ok) {
          setInputValue(''); // 入力をクリア
          setImageFile(null); // 画像をクリア
          fetchChatMessages(); // メッセージを再取得
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // 画像選択ダイアログを開く関数
  const openFileDialog = () => {
    document.getElementById('image-upload').click(); // 隠れたinputをクリック
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
        {messages.map((msg) => (
          <div
            key={msg.ChatContentID}
            className={`message-bubble ${msg.UserID === userId ? 'right' : 'left'}`}
          >
            <p className="message-text">{msg.Content}</p>
            {msg.Image && <img src={`https://loopplus.mydns.jp/${msg.Image}`} alt="メッセージ画像" className="message-image" />}
            <span className="message-time">{msg.CreatedAt}</span>
          </div>
        ))}
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
        <button className="send-button" onClick={handleSendMessage} disabled={!inputValue.trim() && !imageFile}>
          <SendIcon className="send-icon" />
        </button>
      </div>
    </div>
  );

};

export default DirectMessage;

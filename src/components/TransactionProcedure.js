import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/TransactionProcedure.css';

function TransactionProcedure() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [isSending, setIsSending] = useState(false); // 送信中の状態を管理

  // location.stateからデータを取得
  const { itemId, userId, name, time, description, imageSrc,  itemName} = location.state || {}; // stateがundefinedの場合に備える

  if (!location.state) {
    return <div>データがありません。</div>; // stateが存在しない場合の表示
  }

  const handleSend = async () => {
    setError(null); // エラーをリセット
    setSuccess(null); // 成功メッセージをリセット
    setIsSending(true); // 送信中フラグを立てる
  
    if (message.trim()) {
      // チャットルームを作成
      console.log('userID:', userId);
      try {
        const createRoomResponse  = await fetch(`https://loopplus.mydns.jp/api/chatcreate/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ itemId, userId }), // 必要なデータをここに追加
        });
        if (!createRoomResponse.ok) {
          const errorText = await createRoomResponse.text();
          console.error('Error response:', errorText);
          throw new Error('部屋の作成に失敗しました。');
        }
  
        const data = await createRoomResponse.json();
        const item = data.Items;
        console.log(data.roomId);
        if (data.roomId) {
          console.log('data.roomId', data.roomId);

          setChatId(data.roomId); // チャットIDを保存

          await sendMessage(data.roomId); // ここでメッセージを送信

          alert('メッセージを送信しました！');

          navigate(`/dm/${data.roomId}`, { state: { name, item, userId }}); // 新しく取得したroomIdを使用

          await sendPushNotification(data.roomId);// ここでプッシュ通知を送信
        } else if (data.status === 'error') {
          alert('その物品は現在取引中です。');
        } else {
          throw new Error('チャットIDが取得できませんでした。');
        }
        
      } catch (error) {
        console.error('Error:', error);
        setError(error.message); // エラーメッセージを設定
      }
    } else {
      setError('メッセージを入力してください。');
    }
  };
  
  const sendMessage = async (ChatID) => {
    // メッセージを送信
    const payload = {
      Content: message,
      ChatID: ChatID,
    };
  
    const sendResponse = await fetch('https://loopplus.mydns.jp/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  
    if (!sendResponse.ok) {
      const errorText = await sendResponse.text();
      console.error('Error response:', errorText);
      throw new Error('メッセージの送信に失敗しました。');
    }
  
    const result = await sendResponse.json();
    if (result.message === 'success') {
      setSuccess('メッセージが送信されました！');
      setMessage(''); // 入力フィールドをクリア
      setIsSending(false); // 送信完了後に設定
    }
  };
  

  //通知を送信
  const sendPushNotification = async (roomId) => {
    const notification = {
      userId: userId,
      message: `あっ！野生の${itemName}取引希望者が飛び出してきた！`,
      url: `https://loopplus.mydns.jp/dm/${roomId}`
    };

    try {
        const response = await fetch('https://loopplus.mydns.jp/api/send-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notification }),
        });

        const data = await response.json();
        if (data.success) {
            console.log('プッシュ通知が送信されました！');
        } else {
            console.log('通知の送信に失敗しました。');
        }
    } catch (error) {
        console.error('エラー:', error);
        alert('エラーが発生しました。');
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
        <img src={imageSrc} alt="Listing" className="transaction-procedure-listing-image" />
        <div className="transaction-procedure-listing-details">
        <h2 className="transaction-procedure-item-title">{itemName}</h2>
          <span className="badge">譲渡</span>
          <p>{description}</p>
        </div>
      </div>

      <textarea
        className="transaction-procedure-message-input"
        placeholder="出品者へのメッセージを入力してください"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        className="transaction-procedure-send-message-button"
        onClick={handleSend}
        disabled={isSending} // 送信中はボタンを無効化
      >
        メッセージを送信する！
      </button>

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
      {/* <button className="transaction-procedure-send-message-button" onClick={handleCreateRoom}>
        メッセージを送信する！
      </button> */}
    </div>
  );
}

export default TransactionProcedure;

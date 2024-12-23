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
  const { name, itemName, itemId, hostUserId, otherUserId} = location.state || {};//後で直す　ルームができたときに画面遷移したページは出品者のuserIdがhostUserIdと同じものだと認識できてない
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef(null);
  const myId = parseInt(sessionStorage.getItem('MyID'), 10);
  const [TraderID, setTraderId] = useState(undefined); // traderIdを状態として管理
  const [isProcessing, setIsProcessing] = useState(false);

  //Pusherの設定
  useEffect(() => {
    const pusher = new Pusher('f155afe9e8a09487d9ea', {
      cluster: 'ap3',
    });

    const channel = pusher.subscribe(`chat-room-${id}`);
    channel.bind('message-sent', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    channel.bind('message-deleted', (data) => {
      // メッセージを削除するために再読み込み
      fetchChatMessages(); // メッセージを再取得
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id,itemId]);

  // itemIdを使ってtraderIDを取得する関数
  const fetchTraderId = async () => {
    if(itemId !== null){
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/item/${itemId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTraderId(data.TraderID); // traderIdを設定
        console.log(data.TraderID);
      } catch (error) {
        console.error('Error fetching trader ID:', error);
      }
    }
  };

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
    fetchTraderId(); // traderIDを取得
    fetchChatMessages(); // チャットメッセージを取得
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

  //チャットメッセージ非表示化処理
  const deleteMessage = async (chatContentID) => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/chat/message/${chatContentID}`, {
        method: 'PUT',
        credentials: 'include',
      });
      //自分のコメントだけ非表示にできるように後で制限掛ける

      if (response.ok) {
      console.error('メッセージ削除に成功しました');//デバック用message
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

  const handleKeyDown = (event) => {
    if (isSending){
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault(); // デフォルトのEnterキーの動作を防ぐ
      if (inputValue.trim() || imageFile) {
        handleSendMessage();
      }
    }
  };

  // 引渡し予定者にするボタンがクリックされたときの処理
  const handleSetTrader = async () => {
    if (isProcessing) return; // 連投防止
    setIsProcessing(true);

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/flag/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          TraderID: otherUserId, // TraderIDを設定
          TradeFlag: 1 // TradeFlagを2に設定 0＝出品中、1＝取引中、2＝取引完了、3＝非表示中
         }),
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log(data.result);
      if (data.result == 'success') {
        // 成功時の処理
        setTraderId(otherUserId); // 相手のuserIdをtraderIdとして設定
        sessionStorage.setItem('TraderID', otherUserId); // ローカルストレージを更新
        console.log('Trader set successfully');
        console.log('Other User ID:', otherUserId);
      } else {
        console.error('Failed to set trader');
      }
    } catch (error) {
      console.error('Error setting trader:', error);
    } finally {
      setIsProcessing(false); // 処理終了
    }; // traderIdを確認
    // traderIdとotherUserIdの値を確認

  };

  const handleCancelTrade = async () => {
    if (isProcessing) return; // 連投防止
    setIsProcessing(true);

    // 取引を中止する処理をここに追加
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/flag/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          TraderID: null, // TraderIDにnull設定
          TradeFlag: 0 // TradeFlagを0に設定 0＝出品中、1＝取引中、2＝取引完了、3＝非表示中
         }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log(data.result);
      if (data.result == 'success') {
        // 成功時の処理
        setTraderId(null); // 相手のuserIdをtraderIdとして設定
        console.log('Trader set successfully', TraderID);
        console.log('取引が中止されました');
      } else {
        console.error('Failed to set trader');
      }
      
    } catch (error) {
      console.error('Error setting trader:', error);
    } finally {
      setIsProcessing(false); // 処理終了
    }
    // 必要なAPIリクエストを呼び出すなど

  };

  const handleCompleteTrade = async () => {
    if (isProcessing) return; // 連投防止
    setIsProcessing(true);

    try {
        // 取引を完了する処理
        const response = await fetch(`https://loopplus.mydns.jp/api/item/flag/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ itemId: null }), // nullに更新
            credentials: 'include',
        });

        const data = await response.json();
        console.log(data.result);
        if (data.result === 'success') {
            // 取引完了後にチャットのitemIDをnullに更新
            console.log('chatID : ', id);
            const updateResponse = await fetch(`https://loopplus.mydns.jp/api/chat/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    itemId: null // itemIDをnullに更新
                }),
                credentials: 'include',
            });

            const updateData = await updateResponse.json();
            if (updateData.result === 'success') {
                console.log('チャットのitemIDがnullに更新されました');
                
                navigate('/messages');
                
            } else {
                console.error('チャットのitemIDの更新に失敗しました');
            }
            console.log('Update Response:', updateResponse);

        } else {
            console.error('Failed to Reset ItemID');
        }
    } catch (error) {
        console.error('Error setting trader:', error);
    } finally {
      setIsProcessing(false); // 処理終了
    }
    console.log('取引が完了しました');
  };


  return (
    <div className="dm-container">
      <div className="top-navigation">
          <button className="back-button" onClick={() => navigate('/messages')}>
              <ArrowBackIcon className="back-icon" />
          </button>
          <h1 className="page-title">{name}</h1>
      </div>

      <div className="top-buttons">
        {/* ItemIDがnullかつ、tradeFlagが2の場合メッセージを表示 */}
          {itemId === null ? (
              <span className="item-status">
                  現在取引中の物品はありません
              </span>
          ) : hostUserId === myId && TraderID === null ? (
              <
                button className="top-button primary" 
                onClick={handleSetTrader}
                disabled={isProcessing}
              >
                  引渡し予定者にする
              </button>
          ) : TraderID === otherUserId ? (
              <>
                  <button 
                      className="top-button secondary" 
                      onClick={handleCancelTrade} 
                      disabled={isProcessing}
                  >
                      取引を中止する
                  </button>
                  <button 
                      className="top-button success" 
                      onClick={handleCompleteTrade} 
                      disabled={isProcessing}
                  >
                      取引を完了する
                  </button>
              </>
          ) : hostUserId != myId && TraderID === myId ? (
              <span>
                  現在 {itemName} の引渡し予定者に選ばれています
              </span>
          ) : hostUserId !== myId && TraderID === null ? (
              <span className={`item-status`}>
                  現在 {itemName} を取引しています
              </span>
          ) : hostUserId !== myId && TraderID !== myId ? (
            <span>
                現在他のユーザーがの引渡し予定者に選ばれました
            </span>
          ) : null
          }
      </div>


      <div className="dm-messages">
          {messages.map((msg) => {


            const messageDate = new Date(msg.CreatedAt); // メッセージの作成日時
            const today = new Date();
  
            let formattedTime;
            if (
                messageDate.getFullYear() === today.getFullYear() &&
                messageDate.getMonth() === today.getMonth() &&
                messageDate.getDate() === today.getDate()
            ) {
                // 今日の場合
                formattedTime = messageDate.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
            } else {
                // 今日以外の日付の場合
                formattedTime = `${messageDate.getMonth() + 1}/${messageDate.getDate()}`; // 月は0から始まるので1を足す
            }
            return (
              <div
                  key={msg.ChatContentID}
                  className={`message-wrapper ${msg.UserID == myId ? 'right' : 'left'}`}
                  onContextMenu={(e) => {
                      e.preventDefault();
                      // 自分のメッセージの場合のみ長押し処理を呼び出す
                      if (msg.UserID === myId) {
                          handleLongPress(msg.ChatContentID);
                      }
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
              onKeyDown={handleKeyDown}
          />
          <input
              type="text"
              placeholder="メッセージを入力..."
              className="input-box"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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

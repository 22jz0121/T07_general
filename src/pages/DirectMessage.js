import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSwipeable } from "react-swipeable";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Add as AddIcon, Send as SendIcon } from '@mui/icons-material';
import Pusher from 'pusher-js';
import '../css/directMessage.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


const DirectMessage = ({ setIsFooterVisible }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  // const { name, itemName, itemId, hostUserId, otherUserId } = location.state || {};//後で直す　ルームができたときに画面遷移したページは出品者のuserIdがhostUserIdと同じものだと認識できてない
  const { name, item, otherUserId } = location.state || {};
  const itemName = item[0]?.ItemName;
  const itemId = item[0]?.ItemID;
  const hostUserId = item[0]?.UserID;

  // プルダウンで選択されたアイテムのIDと名前の状態を管理
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedhostUserId, setSelectedhostUserId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef(null);
  const myId = parseInt(sessionStorage.getItem('MyID'), 10);
  const myName = sessionStorage.getItem('MyName');
  const [TraderID, setTraderId] = useState(undefined); // traderIdを状態として管理
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(itemId); // itemIdを状態として管理

  //Pusherの設定
  useEffect(() => {
    console.log(item);
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
  }, [id, itemId]);


  //フッター非表示
  useEffect(() => {
    // フッターを非表示にする
    setIsFooterVisible(false);

    // クリーンアップ関数でフッターを再表示
    return () => setIsFooterVisible(true);
  }, [setIsFooterVisible]);


  // アイテムがロードされたときに初期値を設定
  useEffect(() => {
    if (item && item.length > 0) {
      setSelectedItemId(item[0].ItemID); // 最初のアイテムIDを初期値に設定
      setSelectedItemName(item[0].ItemName); // 最初のアイテム名を初期値に設定
      setSelectedhostUserId(item[0].UserID);
    }
  }, [item]);



  // itemIdを使ってtraderIDを取得する関数
  const fetchTraderId = async () => {
    if (itemId !== null) {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/item/${selectedItemId}`);
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
      const response = await fetch(`https://loopplus.mydns.jp/api/chat/room/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  //--------------------------------------------------
  // itemIdが変更されたときにページを再読み込み
  //---------------------------------------------------
  useEffect(() => {
    if (itemId !== currentItemId) {
      window.location.reload(); // ページを再読み込み
    }
  }, [itemId, currentItemId]);

  //--------------------------------------------------
  //　自動スクロールの条件
  //---------------------------------------------------
  // 初回ロード時とメッセージ更新後に限界までスクロールする
  useEffect(() => {
    const forceScrollToBottom = () => {
      const dmMessagesContainer = document.querySelector('.dm-messages');
      if (dmMessagesContainer) {
        dmMessagesContainer.scrollTop = dmMessagesContainer.scrollHeight;
      }
    };

    // 初回ロード時のスクロール（複数回試行）
    setTimeout(forceScrollToBottom, 100);  // 100ms後
    setTimeout(forceScrollToBottom, 300);  // 300ms後
    setTimeout(forceScrollToBottom, 500);  // 500ms後
  }, []);  // 初回ロード時のみ

  useEffect(() => {
    const scrollToBottomWithRetries = () => {
      const dmMessagesContainer = document.querySelector('.dm-messages');
      if (dmMessagesContainer) {
        // 強制スクロール処理
        dmMessagesContainer.scrollTop = dmMessagesContainer.scrollHeight;

        // 少し遅延させてさらにスクロール位置を強制
        setTimeout(() => {
          dmMessagesContainer.scrollTop = dmMessagesContainer.scrollHeight;
          if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    scrollToBottomWithRetries();  // メッセージ更新時に確実にスクロール
  }, [messages]);


  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // await fetchTraderId(); // traderIDを取得
      await fetchChatMessages(); // チャットメッセージを取得
      setIsLoaded(true); // データの取得が完了したらisLoadedをtrueに設定
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchnewData = async () => {
      if (selectedItemId == null) {
        setSelectedItemId(itemId);
      }
      await fetchTraderId(); // traderIDを取得
      setIsLoaded(true); // データの取得が完了したらisLoadedをtrueに設定
    };

    fetchnewData();
  }, [selectedItemId]);

  //--------------------------------------------------
  //　　　　　　なにこれ！！
  //---------------------------------------------------
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  //--------------------------------------------------
  //　　　　　　画像アップ処理
  //---------------------------------------------------
  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
  };



  //--------------------------------------------------
  //　　　　　　チャットメッセージ送信
  //---------------------------------------------------
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


  //--------------------------------------------------
  //　　　　　　長押し時処理
  //---------------------------------------------------
  const handleLongPress = (chatContentID) => {
    const confirmDelete = window.confirm('このメッセージを削除しますか？');
    if (confirmDelete) {
      deleteMessage(chatContentID);
    }
  };



  //--------------------------------------------------
  //　　　　　　チャットメッセージ非表示化処理
  //---------------------------------------------------
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
    if (isSending) {
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault(); // デフォルトのEnterキーの動作を防ぐ
      if (inputValue.trim() || imageFile) {
        handleSendMessage();
      }
    }
  };


  //--------------------------------------------------
  //　　　　　　引き渡し予定者決定
  //---------------------------------------------------
  // 引渡し予定者にするボタンがクリックされたときの処理
  const handleSetTrader = async () => {
    if (isProcessing) return; // 連投防止
    setIsProcessing(true);

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/flag/${selectedItemId}`, {
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
        const message = `あなたが${selectedItemName}の引渡し予定者に選ばれました。`;

        sendPushNotification(otherUserId, message);
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


  //--------------------------------------------------
  //　　　　　　取引中断
  //---------------------------------------------------
  const handleCancelTrade = async () => {
    if (isProcessing) return; // 連投防止
    setIsProcessing(true);

    // 取引を中止する処理をここに追加
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/flag/${selectedItemId}`, {
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


  //--------------------------------------------------
  //　　　　　　取引完了
  //---------------------------------------------------
  const handleCompleteTrade = async () => {
    if (isProcessing) return; // 連投防止
    setIsProcessing(true);

    try {
      // 取引を完了する処理
      const response = await fetch(`https://loopplus.mydns.jp/api/item/flag/${selectedItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          TradeFlag: 2// TradeFlagを0に設定 0＝出品中、1＝取引中、2＝取引完了、3＝非表示中
        }), // nullに更新
        credentials: 'include',
      });

      const data = await response.json();
      console.log(data.result);
      if (data.result === 'success') {
        // 取引完了後にチャットのitemIDをnullに更新
        console.log('chatID : ', id);
        const updateResponse = await fetch(`https://loopplus.mydns.jp/api/chat/delete/${selectedItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        const updateData = await updateResponse.json();
        if (updateData.result === 'success') {
          console.log('チャットのitemIDがnullに更新されました');
          const message = `${myName}との取引が完了しました！`;

          sendPushNotification(otherUserId, message);

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

  //--------------------------------------------------
  //　　　　　　申し込みを辞退する処理
  //---------------------------------------------------
  const handleSetItemIDNull = async () => {
    if (isProcessing) return; // 連投防止
    setIsProcessing(true);

    try {
      // ItemIDをnullにする処理
      const response = await fetch(`https://loopplus.mydns.jp/api/chat/${selectedItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ChatID: id }), // ここでItemIDをnullに設定
        credentials: 'include',
      });

      const data = await response.json();
      console.log(data.result);
      if (data.result === 'success') {
        console.log('ItemIDがnullに更新されました');
        setOpenDialog(true); // ダイアログを表示
      } else {
        console.error('ItemIDの更新に失敗しました');
      }
    } catch (error) {
      console.error('ItemIDの設定中にエラー:', error);
    } finally {
      setIsProcessing(false); // 処理終了
    }
    console.log('ItemIDがnullに設定されました');
  };

  // ダイアログの状態を管理
  const [openDialog, setOpenDialog] = useState(false);

  // ダイアログを閉じて一つ前のページに遷移
  const handleCloseDialog = () => {
    setOpenDialog(false); // ダイアログを閉じる
    navigate('/messages'); // 一つ前のページに遷移
  };


  //--------------------------------------------------
  //　　　　　　プッシュ通知送信
  //---------------------------------------------------
  const sendPushNotification = async (userId, message) => {
    const url = "https://loopplus.mydns.jp/message"

    try {
      const response = await fetch('https://loopplus.mydns.jp/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, message, url }),
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


  //--------------------------------------------------
  //　　　　　　スワイプ時の処理
  //---------------------------------------------------
  // スワイプハンドラーを定義
  const handleSwipe = useSwipeable({
    onSwiped: (event) => {
      console.log(event);
      if (event.dir == "") {
        console.log('読み込みなおそうとしたな！貴様！')
      }
    },
    trackMouse: true, //マウス操作でのスワイプを許可する場合はtrue
  });

  return (
    <div className="dm-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/messages')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">{name}</h1>
      </div>

      <details>
      <div className="top-buttons">
        {isLoaded && (
          <>
            {itemId == null ? (//取引中のアイテムがないとき---------------------------------------------------------------------------------------------------------------------------
              <span className="item-status">
                現在取引中の物品はありません
              </span>
            ) : selectedhostUserId === myId && TraderID === null ? (//自分が出品者かつ引き渡し予定者がいないとき--------------------------------------------------------------------------------
              <span className={`item-status`}>
                <div className='item-status-div'>
                  現在
                  <select
                    className='selectbox-3'
                    value={selectedItemId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedItemId(selectedId); // 選択されたIDを設定

                      // 選択されたアイテムを見つける
                      const selectedItem = item.find(i => i.ItemID == selectedId);
                      setSelectedItemName(selectedItem ? selectedItem.ItemName : ''); // アイテム名を更新
                      setSelectedhostUserId(selectedItem ? selectedItem.UserID : null)
                      console.log(selectedhostUserId);
                    }}
                  >
                    {item.map((i) => (
                      <option key={i.ItemID} value={i.ItemID}>
                        {i.ItemName}
                      </option>
                    ))}
                  </select>
                  を取引しています
                  <br />
                </div>
                <button className="top-button primary" onClick={handleSetTrader} disabled={isProcessing}>
                  引渡し予定者にする
                </button>
              </span>
            ) : TraderID === otherUserId ? (//相手が引き渡し予定者の時---------------------------------------------------------------------------------------------------------------
              <span className={`item-status`}>
                <div className='item-status-div'>
                  現在
                  <select
                    className='selectbox-3'
                    value={selectedItemId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedItemId(selectedId); // 選択されたIDを設定

                      // 選択されたアイテムを見つける
                      const selectedItem = item.find(i => i.ItemID == selectedId);
                      setSelectedItemName(selectedItem ? selectedItem.ItemName : ''); // アイテム名を更新
                      setSelectedhostUserId(selectedItem ? selectedItem.UserID : null)
                      console.log(selectedhostUserId);
                    }}
                  >
                    {item.map((i) => (
                      <option key={i.ItemID} value={i.ItemID}>
                        {i.ItemName}
                      </option>
                    ))}
                  </select>
                  を取引しています
                  <br />
                </div>
                <>
                  <button className="top-button secondary" onClick={handleCancelTrade} disabled={isProcessing}>
                    取引を中止する
                  </button>
                  <button className="top-button success" onClick={handleCompleteTrade} disabled={isProcessing}>
                    取引を完了する
                  </button>
                </>

              </span>
            ) : selectedhostUserId !== myId && TraderID === myId ? (//自分が引き渡し予定者の時-----------------------------------------------------------------------------------------
              <span>
                <div className='item-status-div'>
                  現在
                  <select
                    className='selectbox-3'
                    value={selectedItemId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedItemId(selectedId); // 選択されたIDを設定

                      // 選択されたアイテムを見つける
                      const selectedItem = item.find(i => i.ItemID == selectedId);
                      setSelectedItemName(selectedItem ? selectedItem.ItemName : ''); // アイテム名を更新
                      setSelectedhostUserId(selectedItem ? selectedItem.UserID : null)
                      console.log(selectedhostUserId);
                    }}
                  >
                    {item.map((i) => (
                      <option key={i.ItemID} value={i.ItemID}>
                        {i.ItemName}
                      </option>
                    ))}
                  </select>
                  の引渡し予定者に選ばれています
                </div>
                <button className="top-button-stop" onClick={handleSetItemIDNull} disabled={isProcessing}>
                  取引をキャンセルする
                </button>
              </span>
            ) : selectedhostUserId !== myId && TraderID === null && itemId !== null ? (//自分が取引希望者かつ引き渡し予定者未定の時---------------------------------------------------------
              <span className={`item-status`}>
                <div className='item-status-div'>
                  現在
                  <select
                    className='selectbox-3'
                    value={selectedItemId}
                    onChange={(e) => {
                      const selectedId = e.target.value; // e.target.valueは文字列
                      setSelectedItemId(selectedId);

                      // selectedIdを数値に変換して比較
                      const selectedItem = item.find(i => i.ItemID == selectedId);
                      console.log(selectedItem); // 選択されたアイテムをログ出力
                      setSelectedItemName(selectedItem?.ItemName || ''); // 選択されたアイテム名の更新
                      setSelectedhostUserId(selectedItem ? selectedItem.UserID : null)
                      console.log(selectedhostUserId);
                    }}
                  >
                    {item.map((i) => (
                      <option key={i.ItemID} value={i.ItemID}>
                        {i.ItemName}
                      </option>
                    ))}
                  </select>
                  を取引しています
                  <br />
                </div>
                <button className="top-button-stop" onClick={handleSetItemIDNull} disabled={isProcessing}>
                  取引をキャンセルする
                </button>
              </span>
            ) : selectedhostUserId !== myId && TraderID !== myId ? (//自分が取引希望者かつ引き渡し予定者が他人の時---------------------------------------------------------------------------
              <span>
                現在他のユーザーが引渡し予定者に選ばれました
              </span>
            ) : null}
          </>
        )}
      </div>
      </details>


      <div className="dm-messages">
        {messages.map((msg, index) => {
          const messageDate = new Date(msg.CreatedAt); // メッセージの作成日時
          const today = new Date();

          // 前のメッセージの日付を取得
          const previousMessageDate = index > 0 ? new Date(messages[index - 1].CreatedAt) : null;

          // 日付を表示するかどうかの判断
          const showDate = (
            !previousMessageDate ||
            messageDate.getDate() !== previousMessageDate.getDate() ||
            messageDate.getMonth() !== previousMessageDate.getMonth() ||
            messageDate.getFullYear() !== previousMessageDate.getFullYear()
          );

          // 日付のフォーマット
          let formattedDateMessage = '';
          if (showDate) {
            formattedDateMessage = messageDate.toDateString() === today.toDateString()
              ? '今日'
              : `${messageDate.getMonth() + 1}/${messageDate.getDate()}`; // MM/DD形式
          }

          // 時間のフォーマット
          let formattedTime = '';
          formattedTime = messageDate.toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          return (
            <div key={msg.ChatContentID} >
              {showDate && <div className="date-message">{formattedDateMessage}</div>} {/* 日付の表示 */}
              <div className='message-div'>
                <div
                  className={`message-wrapper ${msg.UserID === myId ? 'right' : 'left'}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                >
                  {/* 透明なdivを追加 */}
                  <div
                    className="delete-overlay"
                    onClick={() => {
                      // クリックで削除機能を呼び出す
                      if (msg.UserID === myId && msg.DisplayFlag === 1) {
                        handleLongPress(msg.ChatContentID);
                      }
                    }}
                  />
                  <div className="message-bubble"
                    data-chat-content-id={msg.ChatContentID}
                  >
                    <p className={`message-text ${msg.DisplayFlag == 0 ? 'off' : 'on'}`}>{msg.Content}</p>
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
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText>
            取引を辞退されました。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DirectMessage;

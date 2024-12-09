import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/TransactionProcedure.css';

function TransactionProcedure() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  
  // location.stateからデータを取得
  const { itemId, name, time, description, imageSrc, title } = location.state || {}; // stateがundefinedの場合に備える

  if (!location.state) {
    return <div>データがありません。</div>; // stateが存在しない場合の表示
  }
  // console.log(location.state); // 追加デバック用後で消す


  const handleSendMessage = () => {
    if (message.trim()) {
      const initialMessage = {
        id: Date.now(),
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };

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
        name: name, // ここで受け取った名前を使用
        message: message,
        time: initialMessage.time,
      };

      if (summaryIndex > -1) {
        summaryMessages[summaryIndex] = summaryMessage;
      } else {
        summaryMessages.push(summaryMessage);
      }
      localStorage.setItem('messages', JSON.stringify(summaryMessages));

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
        <img src={imageSrc} alt="Listing" className="transaction-procedure-listing-image" />
        <div className="transaction-procedure-listing-details">
        <h2 className="transaction-procedure-item-title">{title}</h2>
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

      <button className="transaction-procedure-send-message-button" onClick={handleSendMessage}>
        メッセージを送信する！
      </button>
    </div>
  );
}

export default TransactionProcedure;

// import React, { useState, useEffect } from 'react';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useNavigate, useParams } from 'react-router-dom';
// import '../css/TransactionProcedure.css';

// function TransactionProcedure() {
//   const navigate = useNavigate();
//   const { listingId } = useParams();
//   const [message, setMessage] = useState('');
//   const [itemDetails, setItemDetails] = useState(null); // アイテム詳細を保存するステート

//   // アイテムの詳細を取得
//   useEffect(() => {
//     const fetchItemDetails = async (itemId) => {
//       try {
//         const response = await fetch(`https://your-api-endpoint.com/item/${itemId}`);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setItemDetails(data);
//       } catch (error) {
//         console.error('Error fetching item details:', error);
//       }
//     };

//     fetchItemDetails();
//   }, [listingId]);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const initialMessage = {
//         id: Date.now(),
//         sender: 'user',
//         text: message,
//         time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }),
//       };

//       const itemId = itemDetails.itemId; // APIから取得したitemIdを使用
//       const conversationId = `dm-user-${itemId}`;
      
//       // Save the message to localStorage
//       const existingMessages = JSON.parse(localStorage.getItem(`dm-messages-${conversationId}`)) || [];
//       const updatedMessages = [...existingMessages, initialMessage];
//       localStorage.setItem(`dm-messages-${conversationId}`, JSON.stringify(updatedMessages));

//       // Save the latest message for the DM summary
//       const summaryMessages = JSON.parse(localStorage.getItem('messages')) || [];
//       const summaryIndex = summaryMessages.findIndex((msg) => msg.id === conversationId);

//       const summaryMessage = {
//         id: conversationId,
//         name: '日本電子', // Update appropriately
//         message: message,
//         time: initialMessage.time,
//       };

//       if (summaryIndex > -1) {
//         summaryMessages[summaryIndex] = summaryMessage;
//       } else {
//         summaryMessages.push(summaryMessage);
//       }
//       localStorage.setItem('messages', JSON.stringify(summaryMessages));

//       setMessage(''); // Clear the input field
//       navigate(`/dm/${conversationId}`); // Navigate to DirectMessage page
//     }
//   };

//   if (!itemDetails) {
//     return <div>Loading...</div>; // ローディング表示
//   }

//   const { UserName, CreatedAt, itemImage, itemName, itemContent } = itemDetails;

//   return (
//     <div className="transaction-procedure-container">
//       <div className="top-navigation">
//         <button className="back-button" onClick={() => navigate(-1)}>
//           <ArrowBackIcon className="back-icon" />
//         </button>
//         <h1 className="page-title">取引手続き</h1>
//       </div>

//       <div className="transaction-procedure-listing-info">
//         <img src={itemImage} alt="Listing" className="transaction-procedure-listing-image" />
//         <div className="transaction-procedure-listing-details">
//           <h2 className="transaction-procedure-item-title">{itemName}</h2>
//           <span className="badge">譲渡</span>
//         </div>
//       </div>

//       <textarea
//         className="transaction-procedure-message-input"
//         placeholder="出品者へのメッセージを入力してください"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />

//       <button className="transaction-procedure-send-message-button" onClick={handleSendMessage}>
//         メッセージを送信する！
//       </button>
//     </div>
//   );
// }

// export default TransactionProcedure;

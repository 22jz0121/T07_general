import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/confirmation.css';

const Confirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // location.stateからデータを取得
    const { name, description, transactionMethods, image } = location.state || {};

    // ユーザー情報をsessionStorageから取得
    const myID = sessionStorage.getItem('MyID');
    const myName = sessionStorage.getItem('MyName');
    const myIcon = sessionStorage.getItem('MyIcon');

    // 受け取ったデータをコンソールに表示
    console.log('受け取ったデータ:', { name, description, transactionMethods, image });
    console.log('ユーザー情報:', { myID, myName, myIcon });

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('ItemName', name);
        formData.append('Description', description);
        formData.append('Category', 1); // 適宜選択したカテゴリのIDに変更
        formData.append('TradeMethod', transactionMethods.join(',')); // 取引方法を追加
    
        if (image) {
            formData.append('ItemImage', image); // 画像ファイルを追加
        }
    
        console.log('送信するデータ:', {
            ItemName: name,
            Description: description,
            Category: 1,
            TradeMethod: transactionMethods.join(','),
            ItemImage: image ? image.name : 'なし', // 画像名を表示
        });
    
        try {
            const response = await fetch('https://loopplus.mydns.jp/api/item', {
                method: 'POST',
                body: formData,
                credentials: 'include', // 認証情報を含める
            });
        
            console.log('レスポンス:', response);
            if (response.ok) {
                alert('出品が完了しました！');
                navigate('/'); // ホームページにリダイレクト
            } else {
                const errorData = await response.json();
                console.log('Error response:', errorData); // エラーの詳細をログに表示
                alert(errorData.message || "エラーが発生しました。");
            }
        } catch (error) {
            console.error('Error uploading item:', error);
            alert("ネットワークエラーが発生しました。" + error.message); // エラーメッセージを表示
        }
    };

    return (
        <div className="page-container">
            <div className="top-navigation">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowBackIcon className="back-icon" />
                </button>
                <h1 className="page-title">出品物確認</h1>
            </div>

            <div className="confirmation-content-card">
                <div className="confirmation-user-info">
                    {/* ユーザー情報の表示 */}
                    {myIcon ? (
                        <img src={`https://loopplus.mydns.jp/${myIcon}`} alt="User Avatar" className="confirmation-avatar" />
                    ) : (
                        <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
                    )}
                    <span className="confirmation-user-name">{myName || 'ユーザー名'}</span>
                </div>

                {image && (
                    <img src={URL.createObjectURL(image)} alt="出品物の画像" className="confirmation-item-image" />
                )}

                <h2 className="confirmation-item-title">{name}</h2>
                <p className="confirmation-item-description">{description}</p>

                <div className="confirmation-transaction-details">
                    <div className="confirmation-transaction-method-label">
                        希望取引方法：
                        <span className="confirmation-transaction-method">
                            {transactionMethods.join(' / ')} {/* 取引方法を表示 */}
                        </span>
                    </div>
                </div>

                <p className="confirmation-instruction-text">
                    この内容でよろしければ<br />出品するボタンを押してください
                </p>

                <div className="confirmation-button-container">
                    <button 
                        className="confirmation-submit-button" 
                        onClick={handleSubmit} 
                    >
                        出品する
                    </button>
                    <button className="confirmation-edit-button" onClick={() => navigate(-1)}>修正する</button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;



// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import '../css/confirmation.css';

// const Confirmation = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // location.stateからデータを取得
//     const { name, description, transactionMethods, image } = location.state || {};

//     // ユーザー情報をsessionStorageから取得
//     const myID = sessionStorage.getItem('MyID');
//     const myName = sessionStorage.getItem('MyName');
//     const myIcon = sessionStorage.getItem('MyIcon');

//     // 受け取ったデータをコンソールに表示
//     console.log('受け取ったデータ:', { name, description, transactionMethods, image });
//     console.log('ユーザー情報:', { myID, myName, myIcon });

//     const handleSubmit = async () => {
//         // APIにデータを送信する処理
//         const dataToSend = {
//             ItemName: name,
//             Description: description,
//             Category: 1, // 適宜選択したカテゴリのIDに変更
//             TradeMethod: transactionMethods.join(','),
//         };

//         // 画像をBase64に変換
//         const reader = new FileReader();
//         reader.readAsDataURL(image);
//         reader.onloadend = async () => {
//             dataToSend.ItemImage = reader.result; // Base64形式の画像データを追加

//             console.log('送信するデータ:', dataToSend);

//             try {
//                 const response = await fetch('https://loopplus.mydns.jp/api/item', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(dataToSend), // JSON形式でデータを送信
//                     credentials: 'include',
//                 });

//                 if (response.ok) {
//                     alert('出品が完了しました！');
//                     navigate('/'); // ホームページにリダイレクト
//                 } else {
//                     const errorData = await response.json();
//                     alert(errorData.message || "エラーが発生しました。");
//                 }
//             } catch (error) {
//                 console.error('Error uploading item:', error);
//                 alert("ネットワークエラーが発生しました。");
//             }
//         };
//     };

//     return (
//         <div className="page-container">
//             <div className="top-navigation">
//                 <button className="back-button" onClick={() => navigate(-1)}>
//                     <ArrowBackIcon className="back-icon" />
//                 </button>
//                 <h1 className="page-title">出品物確認</h1>
//             </div>

//             <div className="confirmation-content-card">
//                 <div className="confirmation-user-info">
//                     {/* ユーザー情報の表示 */}
//                     {myIcon ? (
//                         <img src={`https://loopplus.mydns.jp/${myIcon}`} alt="User Avatar" className="confirmation-avatar" />
//                     ) : (
//                         <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
//                     )}
//                     <span className="confirmation-user-name">{myName || 'ユーザー名'}</span>
//                 </div>

//                 {image && (
//                     <img src={URL.createObjectURL(image)} alt="出品物の画像" className="confirmation-item-image" />
//                 )}

//                 <h2 className="confirmation-item-title">{name}</h2>
//                 <p className="confirmation-item-description">{description}</p>

//                 <div className="confirmation-transaction-details">
//                     <div className="confirmation-transaction-method-label">
//                         希望取引方法：
//                         <span className="confirmation-transaction-method">
//                             {transactionMethods.join(' / ')} {/* 取引方法を表示 */}
//                         </span>
//                     </div>
//                 </div>

//                 <p className="confirmation-instruction-text">
//                     この内容でよろしければ<br />出品するボタンを押してください
//                 </p>

//                 <div className="confirmation-button-container">
//                     <button 
//                         className="confirmation-submit-button" 
//                         onClick={handleSubmit} 
//                     >
//                         出品する
//                     </button>
//                     <button className="confirmation-edit-button" onClick={() => navigate(-1)}>修正する</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Confirmation;

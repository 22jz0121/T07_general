import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../css/confirmation.css';

const Confirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false); // ボタンの状態を管理

    // location.stateからデータを取得
    const { name, description, transactionMethods, image } = location.state || {};

    // ユーザー情報をsessionStorageから取得
    const myID = sessionStorage.getItem('MyID');
    const myName = sessionStorage.getItem('MyName');
    const myIcon = sessionStorage.getItem('MyIcon');

    const handleSubmit = async () => {
        setIsSubmitting(true); // ボタンを無効にする
        const formData = new FormData();
        formData.append('ItemName', name);
        formData.append('Description', description);
        formData.append('Category', 1); // 適宜選択したカテゴリのIDに変更
        formData.append('TradeMethod', transactionMethods.join(','));

        if (image) {
            formData.append('ItemImage', image);
        }

        try {
            const response = await fetch('https://loopplus.mydns.jp/api/item', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert('出品が完了しました！');
                navigate('/'); // ホームページにリダイレクト
            } else {
                const errorData = await response.json();
                alert(errorData.message || "エラーが発生しました。");
            }
        } catch (error) {
            alert("ネットワークエラーが発生しました。" + error.message);
        } finally {
            setIsSubmitting(false); // 処理が完了したらボタンを再度有効にする
        }
    };

    // 取引方法のクラスマッピング
    const methodClassMapping = {
        譲渡: 'trade',
        レンタル: 'rental',
        交換: 'exchange',
    };

    // 取引方法を配列に変換
    const methodsArray = Array.isArray(transactionMethods) 
        ? transactionMethods 
        : transactionMethods.split(',').map(method => method.trim());

    // 取引方法の表示
    const methodsDisplay = methodsArray.length > 0
        ? methodsArray.map((method, index) => (
            <span key={index} className={`method-badge ${methodClassMapping[method] || ''}`}>
                {method}
            </span>
        ))
        : "取引方法が選択されていません";

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
                        <div>
                            {methodsDisplay}
                        </div>
                    </div>
                </div>

                <p className="confirmation-instruction-text">
                    この内容でよろしければ<br />出品するボタンを押してください
                </p>

                <div className="confirmation-button-container">
                    <button 
                        className="confirmation-submit-button" 
                        onClick={handleSubmit} 
                        disabled={isSubmitting} // 状態に応じてボタンを無効にする
                    >
                        出品する
                    </button>
                    <button 
                        className="confirmation-edit-button" 
                        onClick={() => navigate('/upload', { state: { name, description, transactionMethods, image } })} 
                        disabled={isSubmitting}
                    >
                        修正する
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;

import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const LikedItemsPage = () => {
    const navigate = useNavigate();

    // Dummy data for liked items
    const [likedItems] = useState([
        {
            id: 1,
            name: '55インチスマートテレビ',
            description: '最新の4K対応スマートテレビ。',
            image: 'https://source.unsplash.com/random/300x200?tv',
        },
        {
            id: 2,
            name: 'ゲーミングチェア',
            description: '快適なゲーム環境を提供するチェア。',
            image: 'https://source.unsplash.com/random/300x200?chair',
        },
        {
            id: 3,
            name: 'ノイズキャンセリングヘッドホン',
            description: '集中力を高めるノイズキャンセリング技術。',
            image: 'https://source.unsplash.com/random/300x200?headphones',
        },
    ]);

    return (
        <div className="liked-items-page">
            {/* Top Navigation */}
            <div className="top-navigation">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowBackIcon className="back-icon" />
                </button>
                <h1 className="page-title">いいね一覧</h1>
            </div>

            {/* Liked Items List */}
            <div className="liked-items-list">
                {likedItems.length > 0 ? (
                    likedItems.map((item) => (
                        <div key={item.id} className="liked-item">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="liked-item-image"
                            />
                            <div className="liked-item-info">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>いいねしたアイテムはありません。</p>
                )}
            </div>
        </div>
    );
};

export default LikedItemsPage;

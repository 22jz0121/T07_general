import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('利用者IDまたは商品名を入力してください。');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://loopplus.mydns.jp/api/searchitem?word=${encodeURIComponent(query)}`);
            const data = await response.json(); // レスポンスをJSON化

            if (!response.ok) throw new Error(data.message || '検索に失敗しました。'); // エラーの場合、メッセージを取得

            console.log("APIからのデータ:", data); // デバッグ用
            navigate('/searchresult', {
              state: { results: data }, // APIからの結果を渡す
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="searchBar">
            <input
                type="text"
                placeholder="商品名を入力してください..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="searchInput"
            />
            <SearchIcon className="searchIcon" onClick={handleSearch} />
            {loading && <div className="loading">検索中...</div>}
            {error && <div className="error">{error}</div>}
        </div>
    );
}


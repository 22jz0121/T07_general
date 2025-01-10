import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../css/search.css';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = async () => {
    if (searchQuery.trim() || category) {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/searchitem?word=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`);
        const data = await response.json();

        // 検索結果が取得できたら、結果画面に遷移
        if (response.ok) {
          navigate('/search-results', {
            state: { results: data }, // APIからの結果を渡す
          });
        } else {
          alert('検索に失敗しました。');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        alert('検索中にエラーが発生しました。');
      }
    } else {
      alert('キーワードまたはカテゴリを入力してください。');
    }
  };

  return (
    <div className="search-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">探す</h1>
      </div>

      <div className="search-form">
        <input
          type="text"
          placeholder="キーワードを入力"
          className="input-field"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="dropdown-container">
          <select
            className="dropdown-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">カテゴリ</option>
            <option value="electronics">電子機器</option>
            <option value="furniture">家具</option>
            <option value="books">本</option>
          </select>
        </div>

        <button className="search-button" onClick={handleSearch}>
          
          <span className="search-text">探す</span>
        </button>
      </div>
    </div>
  );
};

export default Search;

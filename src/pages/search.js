// src/pages/Search.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import '../css/search.css';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() || category) {
      navigate('/search-results', {
        state: { searchQuery, category },
      });
    } else {
      alert('Please enter a keyword or select a category.');
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
        {/* Input Field */}
        <input
          type="text"
          placeholder="キーワードを入力"
          className="input-field"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Dropdown for Category */}
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

        {/* Search Button */}
        <button className="search-button" onClick={handleSearch}>
          <SearchIcon className="search-icon" />
          <span className="search-text">探す</span>
        </button>
      </div>
    </div>
  );
};

export default Search;

import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Import Arrow Back icon from Material UI
import SearchIcon from '@mui/icons-material/Search';  // Import Search icon from Material UI
import '../css/search.css';  // Ensure the correct path for your CSS file

const Search = () => {
  const navigate = useNavigate();  // Initialize the navigation hook

  return (
    <div className="upload-container">
      {/* Top navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}> {/* Navigate to "/" on click */}
          <ArrowBackIcon className="back-icon" /> {/* Use Material UI ArrowBackIcon */}
        </button>
        <h1 className="page-title">探す</h1>
      </div>

      {/* Search form */}
      <div className="search-form">
        {/* Input field */}
        <input
          type="text"
          placeholder="キーワードを入力"
          className="input-field"
        />

        {/* Category dropdown */}
        <div className="dropdown-container">
          <select className="dropdown-select">
            <option value="">カテゴリ</option>
            <option value="category1">カテゴリー 1</option>
            <option value="category2">カテゴリー 2</option>
            <option value="category3">カテゴリー 3</option>
          </select>
        </div>

        {/* Search button */}
        <button className="search-button">
          <SearchIcon className="search-icon" />
          <span className="search-text">探す</span>
        </button>
      </div>
    </div>

  );
};

export default Search;

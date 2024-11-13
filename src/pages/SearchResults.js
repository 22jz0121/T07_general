// src/pages/SearchResults.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Item from '../components/Item';
import '../css/searchResults.css';

const sampleData = [
  {
    itemId: 1,
    name: '電子太郎',
    time: '1:20 PM',
    imageSrc: 'path/to/image1.jpg',
    title: '55インチのスマートテレビ',
    description: '最新の4K対応で、55インチのスマートテレビです。',
    category: 'electronics',
    location: '12号館'
  },
  {
    itemId: 2,
    name: '日本電子',
    time: '3:40 PM',
    imageSrc: 'path/to/image2.jpg',
    title: '木製のダイニングテーブル',
    description: '木製で非常に頑丈なダイニングテーブルです。',
    category: 'furniture',
    location: '10号館'
  },
  // Add more items as needed
];

function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, category } = location.state || {};

  // Filter sample data based on search query and category
  const filteredResults = sampleData.filter(item => {
    const matchesQuery = searchQuery ? item.title.includes(searchQuery) || item.description.includes(searchQuery) : true;
    const matchesCategory = category ? item.category === category : true;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="search-results-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">検索結果</h1>
      </div>

      <div className="items-list">
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <Item
              key={item.itemId}
              itemId={item.itemId}
              name={item.name}
              time={item.time}
              imageSrc={item.imageSrc}
              title={item.title}
              description={item.description}
              location={item.location}
            />
          ))
        ) : (
          <p className="no-results">該当する結果が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

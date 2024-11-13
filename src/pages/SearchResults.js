// src/pages/SearchResults.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Item from '../components/Item';
import tvImage from '../img/tv-image.png';
import '../css/searchResults.css';

// Sample data
const sampleData = [
  {
    itemId: '1',
    name: '日本電子',
    time: '3秒前',
    imageSrc: tvImage,
    title: '55インチのスマートテレビ',
    description: '最新の4K対応で、55インチのスマートテレビです。',
    category: 'electronics',
    location: '受け渡し場所：12号館'
  },
  {
    itemId: '2',
    name: '電子太郎',
    time: '5分前',
    imageSrc: tvImage,
    title: '高性能ノートパソコン',
    description: '16GB RAMと1TB SSDを搭載したノートパソコンです。',
    category: 'electronics',
    location: '受け渡し場所：10号館'
  },
  {
    itemId: '3',
    name: '電子次郎',
    time: '10分前',
    imageSrc: tvImage,
    title: 'デスクチェア',
    description: 'エルゴノミックデザインの快適なデスクチェアです。',
    category: 'furniture',
    location: '受け渡し場所：8号館'
  },
  {
    itemId: '4',
    name: '菅原大翼',
    time: '15分前',
    imageSrc: tvImage,
    title: '本棚',
    description: 'たくさんの本を収納できる、丈夫な木製の本棚です。',
    category: 'furniture',
    location: '受け渡し場所：C棟ロビー'
  },
  {
    itemId: '5',
    name: 'マサトシ',
    time: '20分前',
    imageSrc: tvImage,
    title: 'ギター',
    description: '初心者にも最適なアコースティックギターです。',
    category: 'music',
    location: '受け渡し場所：スタジオ部屋'
  },
  // Add more items as needed
];

function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, category } = location.state || {};

  // Filter sample data based on search query and category
  const filteredResults = sampleData.filter(item => {
    const matchesQuery = searchQuery
      ? item.title.includes(searchQuery) || item.description.includes(searchQuery)
      : true;
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
          filteredResults.map(item => (
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

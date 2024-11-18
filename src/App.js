// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/top';
import ItemList from './components/ItemList';
import ListingDetail from './components/ListingDetail';
import TransactionProcedure from './components/TransactionProcedure';
import RequestPage from './pages/RequestPage';
import RequestDetail from './pages/RequestDetail'; // Import RequestDetail component
import Upload from './pages/upload';
import Search from './pages/search';
import SearchResults from './pages/SearchResults';
import Messages from './pages/messages';
import MyPage from './pages/MyPage';
import DirectMessage from './pages/DirectMessage';
import Confirmation from './pages/Confirmation';
import PostAddPage from './pages/PostAddPage'; // Import PostAddPage component
import Footer from './components/Footer';
import './css/top.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/listings" element={<ItemList />} />
          <Route path="/listing/:listingId" element={<ListingDetail />} />
          <Route path="/transaction/:listingId" element={<TransactionProcedure />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/request/:id" element={<RequestDetail />} /> {/* Route for request details */}
          <Route path="/upload" element={<Upload />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/dm/:id" element={<DirectMessage />} />
          <Route path="/post-add" element={<PostAddPage />} /> {/* New route for post add page */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

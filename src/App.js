import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/top';
import ItemList from './components/ItemList';
import ListingDetail from './components/ListingDetail';
import TransactionProcedure from './components/TransactionProcedure';
import RequestPage from './pages/RequestPage';
import Upload from './pages/upload';
import Search from './pages/search';
import SearchResults from './pages/SearchResults'; // Import the new SearchResults component
import Messages from './pages/messages';
import MyPage from './pages/MyPage';
import DirectMessage from './pages/DirectMessage';
import Footer from './components/Footer';
import './css/top.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/listings" element={<ItemList />} /> {/* Route for item list */}
          <Route path="/listing/:listingId" element={<ListingDetail />} /> {/* Dynamic route for listing details */}
          <Route path="/transaction/:listingId" element={<TransactionProcedure />} /> {/* New route for transaction procedure */}
          <Route path="/request" element={<RequestPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} /> {/* New route for search results */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/dm/:id" element={<DirectMessage />} /> {/* DM route */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

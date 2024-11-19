import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/top';
import ItemList from './components/ItemList';
import ListingDetail from './components/ListingDetail'; // Import the detail component
import RequestPage from './pages/RequestPage';
import Upload from './pages/upload';
import Search from './pages/search';
import Messages from './pages/messages';
import MyPage from './pages/MyPage'
import DirectMessage from './pages/DirectMessage'; // Import the DM p age
import Footer from './components/Footer'; // Import Footer component
import Login from './components/Login'
import GoogleCallback from './components/GoogleCallback'
import './css/top.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/" element={<ItemList />} /> {/* Item list page */}
          <Route path="/listing/:listingId" element={<ListingDetail />} /> {/* Detail page */}
          <Route path="/request" element={<RequestPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/dm/:id" element={<DirectMessage />} /> {/* Dynamic route for each DM */}
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<GoogleCallback />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

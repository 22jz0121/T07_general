import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/top';
import ItemList from './components/ItemList';
import ListingDetail from './components/ListingDetail';
import TransactionProcedure from './components/TransactionProcedure';
import RequestPage from './pages/RequestPage';
import RequestDetail from './pages/RequestDetail';
import Upload from './pages/upload';
import Search from './pages/search';
import SearchResults from './pages/SearchResults';
import Messages from './pages/messages';
import MyPage from './pages/MyPage';
import DirectMessage from './pages/DirectMessage';
import Confirmation from './pages/Confirmation';
import PostAddPage from './pages/PostAddPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import Footer from './components/Footer';
import Login from './components/Login';
import GoogleCallback from './components/GoogleCallback';
import LikedItemsPage from './pages/LikedItemsPage';
import HistoryPage from './pages/HistoryPage';
import QAPage from './pages/QAPage';
import PrivateRoute from './components/PrivateRoute'; // PrivateRouteをインポート

import './css/top.css';

function App() {
  const [requests, setRequests] = useState([]);

  const handleRequestAdded = (newRequest) => {
    setRequests((prevRequests) => [...prevRequests, newRequest]);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/listings" element={<ItemList />} />
          <Route path="/listing/:listingId" element={<ListingDetail />} />
          <Route path="/transaction/:listingId" element={<TransactionProcedure />} />
          <Route path="/request" element={<PrivateRoute><RequestPage requests={requests} /></PrivateRoute>} />
          <Route path="/request/:id" element={<PrivateRoute><RequestDetail /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/confirmation" element={<PrivateRoute><Confirmation /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
          <Route path="/search-results" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="/dm/:id" element={<PrivateRoute><DirectMessage /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<GoogleCallback />} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/post-add" element={<PrivateRoute><PostAddPage onRequestAdded={handleRequestAdded} /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/profile-edit/:userId" element={<PrivateRoute><ProfileEditPage /></PrivateRoute>} />
          <Route path="/google-callback" element={<GoogleCallback />} />
          <Route path="/liked-items" element={<PrivateRoute><LikedItemsPage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/qa" element={<PrivateRoute><QAPage /></PrivateRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

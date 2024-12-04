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
import ProfileEditPage from './pages/ProfileEditPage'; // Import ProfileEditPage
import Footer from './components/Footer';
import Login from './components/Login';
import GoogleCallback from './components/GoogleCallback';
import LikedItemsPage from './pages/LikedItemsPage';
import HistoryPage from './pages/HistoryPage'; // Ensure correct path
import QAPage from './pages/QAPage'; // Q&Aページをインポート
// import ListingDetail from './pages/LikedItemsPage'; // アイテム詳細ページのコンポーネントをインポート



import './css/top.css';

function App() {
  const [requests, setRequests] = useState([]); // リクエストの状態を管理

  const handleRequestAdded = (newRequest) => {
    setRequests((prevRequests) => [...prevRequests, newRequest]); // 新しいリクエストを追加
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/listings" element={<ItemList />} />
          <Route path="/listing/:listingId" element={<ListingDetail />} />
          <Route path="/transaction/:listingId" element={<TransactionProcedure />} />
          <Route path="/request" element={<RequestPage requests={requests} />} /> {/* requestsをRequestPageに渡す */}
          <Route path="/request/:id" element={<RequestDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/dm/:id" element={<DirectMessage />} /> {/* Dynamic route for each DM */}
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<GoogleCallback />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/post-add" element={<PostAddPage onRequestAdded={handleRequestAdded} />} /> {/* onRequestAddedを渡す */}
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/profile-edit/:userId" element={<ProfileEditPage />} /> {/* Route for ProfileEditPage */}
          <Route path="/google-callback" element={<GoogleCallback />} />
          <Route path="/liked-items" element={<LikedItemsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/qa" element={<QAPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

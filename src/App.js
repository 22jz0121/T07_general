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
import Push from './components/Push';
import Ban from './pages/Ban';
import PrivateRoute from './components/PrivateRoute'; // PrivateRouteをインポート

//管理ページ
import UserManagement from './pages/UserManagement/UserManagement';
import UserProfile from './pages/UserProfile/UserProfile';
import UserItemList from './pages/UserItemList/UserItemList';
import UserRequestList from './pages/UserRequestList/UserRequestList';
import UserTradingHistory from './pages/UserTradingHistory/UserTradingHistory';
import QAList from './pages/QAList/QAList';
import QAadd from './pages/QAadd/QAadd';
import UserWarning from './pages/UserWarning/UserWarning';
import ProductWarning from './pages/ProductWarning/ProductWarning';
import ListedProducts from './pages/ListedProducts/ListedProducts';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import SearchResult from './components/SearchBar/SearchResult';



import './css/top.css';

function App() {
  const [requests, setRequests] = useState([]);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  const handleRequestAdded = (newRequest) => {
    setRequests((prevRequests) => [...prevRequests, newRequest]);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ユーザーサイド */}
          <Route path="/" element={<PrivateRoute><Top /></PrivateRoute>} />
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
          <Route path="/login" element={<Login setIsFooterVisible={setIsFooterVisible} />} />
          <Route path="/callback" element={<GoogleCallback setIsFooterVisible={setIsFooterVisible} />} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/post-add" element={<PrivateRoute><PostAddPage onRequestAdded={handleRequestAdded} /></PrivateRoute>} />
          <Route path="/profile/:userId" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/profile-edit/:userId" element={<PrivateRoute><ProfileEditPage /></PrivateRoute>} />
          <Route path="/liked-items" element={<PrivateRoute><LikedItemsPage /></PrivateRoute>} />
          <Route path="/history/:id" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/qa" element={<PrivateRoute><QAPage /></PrivateRoute>} />
          <Route path="/test" element={<PrivateRoute><Push /></PrivateRoute>} />
          <Route path="/error" element={<Ban setIsFooterVisible={setIsFooterVisible} />} />


          {/* 管理ページ */}
          <Route path="/adminlogin" element={<Login setIsFooterVisible={setIsFooterVisible} />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/user-profile/:id" element={<UserProfile />} />
          <Route path="/useritemlist" element={<UserItemList />} />
          <Route path="/userrequestlist" element={<UserRequestList />} />
          <Route path="/usertradinghistorylist" element={<UserTradingHistory />} />
          <Route path="/qalist" element={<QAList />} />
          <Route path="/qaadd" element={<QAadd />} />
          <Route path="/user-warning/:userId" element={<UserWarning />} />
          <Route path="/listedproducts" element={<ListedProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product-warning/:productId" element={<ProductWarning />} />
          <Route path="/searchresult" element={<SearchResult />} />
          <Route path="/product-detail" element={<ProductDetail />} />
        </Routes>
        {isFooterVisible && <Footer />}
      </div>
    </Router>
  );
}

export default App;

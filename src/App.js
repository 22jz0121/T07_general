import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/top';  // Home page (top.js)
import RequestPage from './pages/RequestPage';  // Request page
import Upload from './pages/upload';  // Upload page
import Search from './pages/search';  // Search page
import Messages from './pages/messages';  // Messages page
import MyPage from './pages/MyPage';  // MyPage component
import Footer from './components/Footer'; // Import Footer component
import './css/top.css';  // Global CSS

function App() {
  return (
    <Router>
      <div className="App">
        {/* Define Routes for navigation */}
        <Routes>
          <Route path="/" element={<Top />} />  {/* "/" renders Top */}
          <Route path="/request" element={<RequestPage />} />
          <Route path="/upload" element={<Upload />} /> {/* Upload page */}
          <Route path="/search" element={<Search />} /> {/* Search page */}
          <Route path="/messages" element={<Messages />} /> {/* Messages page */}
          <Route path="/mypage" element={<MyPage />} /> {/* MyPage component */}
        </Routes>

        {/* Add the Footer at the bottom, outside of the Routes */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

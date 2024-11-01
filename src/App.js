import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/top';
import RequestPage from './pages/RequestPage';
import Upload from './pages/upload';
import Search from './pages/search';
import Messages from './pages/messages';
import MyPage from './pages/MyPage'
import DirectMessage from './pages/DirectMessage'; // Import the DM page
import Footer from './components/Footer'; // Import Footer component
import './css/top.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/dm/:id" element={<DirectMessage />} /> {/* Dynamic route for each DM */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/top';  // Home page (top.js)
import RequestPage from './pages/RequestPage';  // Request page
import Upload from './pages/upload';  
import Footer from './components/Footer'; // Import Footer component
import './css/top.css';  // Global CSS


function App() {
  return (
    <Router>
      <div className="App">
        {/* Define Routes for navigation */}
        <Routes>
          <Route path="/home" element={<Top />} />  {/* "/" renders Top */}
          <Route path="/request" element={<RequestPage />} />
          {/* Add more routes as necessary */}
          <Route path="/home" element={<Top />} />  {/* Example for home page */}
          <Route path="/search" element={<div>Search Page</div>} /> {/* Placeholder */}
          <Route path="/upload" element={<Upload />} /> {/* Placeholder */}
          <Route path="/messages" element={<div>Messages Page</div>} /> {/* Placeholder */}
          <Route path="/mypage" element={<div>MyPage</div>} /> {/* Placeholder */}
        </Routes>

        {/* Add the Footer at the bottom, outside of the Routes */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

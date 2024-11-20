import React from 'react';
import TopSection from '../components/TopSection';
import RequestList from '../components/RequestList';
import Footer from '../components/Footer';
import '../css/RequestPage.css';

function RequestPage() {
  return (
    <div className="app">
      <TopSection />
      <Footer />
    </div>
  );
}

export default RequestPage;

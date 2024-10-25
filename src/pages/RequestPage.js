import React from 'react';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import RequestList from '../components/RequestList';
import Footer from '../components/Footer';
import '../css/RequestPage.css';

function RequestPage() {
  return (
    <div className="app">
      <Header />
      <TabBar />
      <RequestList />
      <Footer />
    </div>
  );
}

export default RequestPage;

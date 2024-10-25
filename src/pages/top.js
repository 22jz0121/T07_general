import React from 'react';
import Header from '../components/Header';  // Keep the header only in this file
import TabBar from '../components/TabBar';
import ItemList from '../components/ItemList';
import Footer from '../components/Footer';
import '../css/top.css';

function Top() {
  return (
    <div>
      <Header />
      <TabBar />
      <ItemList />
      <Footer />
    </div>
  );
}

export default Top;

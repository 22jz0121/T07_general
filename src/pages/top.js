import React from 'react';
import TopSection from '../components/TopSection';  
import ItemList from '../components/ItemList';
import Footer from '../components/Footer';
import '../css/top.css';

function Top() {
  return (
    <div>
      <TopSection />
      <ItemList />
      <Footer />
    </div>
  );
}

export default Top;

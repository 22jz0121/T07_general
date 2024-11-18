// src/components/ItemList.js

import React, { useEffect, useState } from 'react';
import Item from './Item';

function ItemList({ userId }) { // Accept userId as a prop
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    // Filter items by userId
    const userItems = storedItems.filter(item => item.userId === userId);
    setItems(userItems);
  }, [userId]);

  return (
    <div className="listing">
      {items.length > 0 ? (
        items.map(item => (
          <Item
            key={item.id}
            itemId={item.id}
            name={item.name}
            time={item.timestamp}
            imageSrc={item.image}
            title={item.name}
            description={item.description}
            location={`取引場所：${item.location}`}
            transactionMethods={item.transactionMethods} // Pass transaction methods
          />
        ))
      ) : (
        <p className='p'>出品物はありません。</p>
      )}
    </div>
  );
}

export default ItemList;

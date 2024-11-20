import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Item from './Item';

function ItemList({ userId }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    const userItems = storedItems.filter((item) => item.userId === userId);
    setItems(userItems);
  }, [userId]);

  const handleItemClick = (itemId) => {
    navigate(`/listing/${itemId}`);
  };

  return (
    <div className="listing">
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <Item
              itemId={item.id}
              name={item.name}
              time={item.timestamp}
              imageSrc={item.image}
              title={item.name}
              description={item.description}
              location={`取引場所：${item.location}`}
              transactionMethods={item.transactionMethods}
            />
          </div>
        ))
      ) : (
        <p className="p">出品物はありません。</p>
      )}
    </div>
  );
}

export default ItemList;

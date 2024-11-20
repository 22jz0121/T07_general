import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Item from './Item';

function ItemList() {
  const [items, setItems] = useState([]); // Fetched items
  const [loading, setLoading] = useState(true); // Loading state
  const [likedItems, setLikedItems] = useState([]); // Locally liked items
  const [myFavoriteIds, setMyFavoriteIds] = useState([]); // Favorites from backend
  const [error, setError] = useState(null); // Error state
  const isMounted = useRef(true); // Component mount state
  const navigate = useNavigate(); // Navigation

  useEffect(() => {
    isMounted.current = true;

    const fetchItems = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/item');
        if (!response.ok) {
          throw new Error('Failed to fetch items.');
        }
        const data = await response.json();
        if (isMounted.current) {
          setItems(data);
        }
      } catch (err) {
        if (isMounted.current) setError(err.message);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    const fetchMyFavorites = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/api/myfavorite', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch favorites.');
        }
        const data = await response.json();
        if (isMounted.current) {
          setMyFavoriteIds(data.map((item) => item.ItemID));
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    fetchItems();
    fetchMyFavorites();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLike = (itemId) => {
    const isLiked = likedItems.includes(itemId);
    const method = isLiked ? 'DELETE' : 'POST'; // Decide the method
    sendFavoriteRequest(itemId, method);

    // Update local liked state
    setLikedItems((prevLiked) =>
      isLiked ? prevLiked.filter((id) => id !== itemId) : [...prevLiked, itemId]
    );
  };

  const sendFavoriteRequest = async (itemId, method) => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${itemId}`, {
        method,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to ${method === 'POST' ? 'like' : 'unlike'} item.`);
      }
      const data = await response.json();
      console.log('Server response:', data);
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/listing/${itemId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map((item) => (
        <Item
          key={item.ItemID}
          itemId={item.ItemID}
          title={item.ItemName}
          imageSrc={`https://loopplus.mydns.jp/storage/images/${item.ItemImage}`} // Image URL
          description={item.Description}
          onLike={handleLike}
          liked={likedItems.includes(item.ItemID)} // Pass liked state
          onClick={() => handleItemClick(item.ItemID)} // Navigate to details
        />
      ))}
    </div>
  );
}

export default ItemList;

import React, { useEffect, useState, useRef } from 'react';
import Item from './Item';

function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState([]); // ユーザーがいいねしたアイテム
  const [myFavoriteIds, setMyFavoriteIds] = useState([]); // /myfavorite から取得したアイテムID
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchItems = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/item');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isMounted.current) {
          setItems(data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    const fetchMyFavorites = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/api/myfavorite', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isMounted.current) {
          // myFavoriteIdsにItemIDを保存
          setMyFavoriteIds(data.map(item => item.ItemID));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchItems();
    fetchMyFavorites();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLike = (itemId) => {
    console.log('handleLike called with itemId:', itemId);
    const isLiked = likedItems.includes(itemId);
    const isMyFavorite = myFavoriteIds.includes(itemId); // /myfavoriteから取得したIDと比較

    // DELETEかPOSTかを判断
    const method = isMyFavorite ? 'DELETE' : 'POST';
    sendFavoriteRequest(itemId, method);

    // likedItemsの更新
    setLikedItems((prevLikedItems) => {
      return isLiked ? prevLikedItems.filter(id => id !== itemId) : [...prevLikedItems, itemId];
    });
  };

  const sendFavoriteRequest = async (itemId, method) => {
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${itemId}`, {
        method: method,
        credentials: 'include',
        // headers: {
          // 'Content-Type': 'application/json',
          // 'X-CSRF-TOKEN': csrfToken,
        // },
        // POSTの場合はボディを追加、DELETEの場合はボディを付けない
        // body: method === 'POST' ? JSON.stringify({ itemId }) : undefined,
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // エラーレスポンスを取得
        console.error('Error response:', errorData); // エラーレスポンスをログに出力
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleItemClick = (itemId) => {
    navigate(`/listing/${itemId}`);
  };

  return (
    <div>
      {items.map(item => (
        <Item 
          key={item.ItemID} 
          itemId={item.ItemID} 
          title={item.ItemName} 
          imageSrc={`${item.ItemImage}`}
          description={item.Description} 
          onLike={handleLike}
        />
      ))}
    </div>
  );
}

export default ItemList;


// import React, { useEffect, useState, useRef } from 'react';
// import Item from './Item';

// function ItemList() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [likedItems, setLikedItems] = useState([]);
//   const isMounted = useRef(true); // コンポーネントのマウント状態を管理

//   useEffect(() => {
//     isMounted.current = true;

//     const fetchItems = async () => {
//       try {
//         const response = await fetch('https://loopplus.mydns.jp/item');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         if (isMounted.current) {
//           setItems(data);
//           console.log(data);
//         }
//       } catch (error) {
//         console.error('Error fetching items:', error);
//       } finally {
//         if (isMounted.current) {
//           setLoading(false);
//         }
//       }
//     };

//     const fetchWhoAmI = async () => {
//       // const token = localStorage.getItem("authToken"); // ローカルストレージからトークンを取得
//       // console.log(token);
//       // if (!token) {
//       //   console.error("No token found in local storage");
//       //   return;
//       // }

//       try {
//         const response = await fetch('https://loopplus.mydns.jp/api/whoami', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             // 'Authorization': `Bearer ${token}`,
//           },
//           credentials: 'include',
//         });
//         if (!response.ok) {
//           throw new Error(`Network response was not ok: ${response.statusText}`);
//         }
//         const data = await response.json();
//         console.log('WhoAmI Response:', data); // whoamiの結果を表示
//       } catch (error) {
//         console.error('Error fetching whoami:', error);
//       }
//     };

//     fetchItems();
//     fetchWhoAmI();

//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const handleLike = (itemId) => {
//     console.log('handleLike called with itemId:', itemId);
//     setLikedItems((prevLikedItems) => {
//       const isLiked = prevLikedItems.includes(itemId);
//       sendFavoriteRequest(itemId, isLiked ? 'DELETE' : 'POST');
//       return isLiked ? prevLikedItems.filter(id => id !== itemId) : [...prevLikedItems, itemId];
//     });
//   };

//   const sendFavoriteRequest = async (itemId, method) => {
//     try {
//       const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${itemId}`, {
//         method: method,
//         credentials: 'include',
//       });
//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }
//       const data = await response.json();
//       console.log('Response from server:', data);
//     } catch (error) {
//       console.error('Error sending request:', error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {items.map(item => (
//         <Item 
//           key={item.ItemID} 
//           itemId={item.ItemID} 
//           title={item.ItemName} 
//           imageSrc={`https://loopplus.mydns.jp/storage/images/${item.ItemImage}`}
//           description={item.Description} 
//           onLike={handleLike}
//         />
//       ))}
//     </div>
//   );
// }

// export default ItemList;

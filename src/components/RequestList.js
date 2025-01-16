import React, { useState, useEffect, useRef } from 'react';
import PostButton from './PostButton';
import RequestItem from './RequestItem';
import '../css/RequestPage.css';

function RequestList({ showPostButton = true }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchRequests();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://loopplus.mydns.jp/request');
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();

      if (isMounted.current) {
        // DisplayFlagが1のリクエストのみをフィルタリング
        const filteredData = data.filter(request => request.DisplayFlag === 1);
        const sortedData = filteredData.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setRequests(sortedData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className='loading'><img src='/Loading.gif' alt="Loading" /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="request-list">
      {requests.length > 0 ? (
        requests.map((request) => (
          <RequestItem
            key={request.RequestID}
            id={request.RequestID}
            userId={request.UserID} // Correctly pass userId
            name={request.User ? request.User.UserName : '不明'}
            time={request.CreatedAt}
            content={request.RequestContent}
            imageSrc={request.RequestImage ? `https://loopplus.mydns.jp/${request.RequestImage}` : null}
            userIcon={request.User && request.User.Icon}
          />
        ))
      ) : (
        <p>リクエストはありません。</p>
      )}
      {showPostButton && <PostButton />}
    </div>
  );
}

export default RequestList;

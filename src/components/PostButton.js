// src/components/PostButton.js
import React from 'react';
import { Add as AddIcon } from '@mui/icons-material'; // Import Material UI Add icon
import '../css/RequestPage.css'; // Assuming the CSS file for styling exists

function PostButton() {
  const handlePostClick = () => {
    alert("Starting a new post!");
  };

  return (
    <div className="post-button" onClick={handlePostClick}>
      <AddIcon className="post-icon" />
    </div>
  );
}

export default PostButton;

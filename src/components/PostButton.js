// src/components/PostButton.js
import React from 'react';
import { Add as AddIcon } from '@mui/icons-material'; // Material UI Add icon
import { useNavigate } from 'react-router-dom';
import '../css/RequestPage.css';

function PostButton() {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate('/post-add'); // Navigate to the "Post Add" page
  };

  return (
    <div className="post-button" onClick={handlePostClick}>
      <AddIcon className="post-icon" />
    </div>
  );
}

export default PostButton;

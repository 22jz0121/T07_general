// src/pages/PostAddPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import '../css/RequestPage.css';

function PostAddPage() {
  const navigate = useNavigate();
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = () => {
    if (postText.trim() || image) {
      // Load existing posts from localStorage
      const existingPosts = JSON.parse(localStorage.getItem('requests')) || [];

      // Create a new post object
      const newPost = {
        id: Date.now(),
        name: '自分の名前', // Replace with the user's actual name if available
        time: '今', // Use a library like date-fns or moment.js for accurate timestamps
        description: postText,
        imageSrc: image,
      };

      // Save the new post to localStorage
      localStorage.setItem('requests', JSON.stringify([newPost, ...existingPosts]));

      // Redirect to the request list
      navigate('/request');
    } else {
      alert('テキストか画像を入力してください！');
    }
  };

  return (
    <div className="post-add-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">リクエスト</h1>
      </div>

      {/* Text Input */}
      <textarea
        className="post-textarea"
        placeholder="どんなものが欲しいかリクエストしてみましょう"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      ></textarea>

      {/* Image Upload */}
      <div className="uploads-button">
        <label htmlFor="image-upload" className="image-upload-label">
          <ImageIcon className="mr-2" />
          画像を追加してください
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="プレビュー画像" className="image-preview" />
        </div>
      )}

      {/* Submit Button */}
      <button className="post-submit-button" onClick={handlePostSubmit}>
        リクエストする
      </button>
    </div>
  );
}

export default PostAddPage;

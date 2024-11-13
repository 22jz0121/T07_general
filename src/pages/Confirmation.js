// src/pages/Confirmation.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../css/confirmation.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state;

  // User state for name and avatar
  const [user, setUser] = useState({ name: '', avatar: '' });

  useEffect(() => {
    // Retrieve the logged-in user's information from localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest', avatar: '' };
    setUser(storedUser);
  }, []);

  const handleSubmit = () => {
    // Prepare item data for saving
    const newItem = {
      id: Date.now(),
      ...formData,
      transactionMethods: formData.transactionMethods, // Include transaction methods
      timestamp: new Date().toLocaleString('ja-JP'),
      image: formData.image ? URL.createObjectURL(formData.image) : '',
      user, // Include user details
    };

    // Retrieve existing items from localStorage
    const existingItems = JSON.parse(localStorage.getItem('items')) || [];

    // Add the new item to the list and save back to localStorage
    const updatedItems = [...existingItems, newItem];
    localStorage.setItem('items', JSON.stringify(updatedItems));

    // Notify the user and redirect
    alert('出品が完了しました！');
    localStorage.removeItem('formData'); // Clear saved form data
    navigate('/'); // Redirect to homepage
  };

  const handleEdit = () => {
    // Save only text fields and selections to localStorage, excluding the image file
    const { name, description, transactionMethods, location } = formData;
    const formDataToSave = { name, description, transactionMethods, location };
    localStorage.setItem('formData', JSON.stringify(formDataToSave));
    navigate(-1); // Go back to the upload page
  };

  return (
    <div className="page-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">出品物確認</h1>
      </div>

      <div className="confirmation-content-card">
        <div className="confirmation-user-info">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="confirmation-avatar" />
          ) : (
            <div className="confirmation-avatar-placeholder" /> // Placeholder if no avatar
          )}
          <span className="confirmation-user-name">{user.name}</span>
        </div>

        <img src={formData.image ? URL.createObjectURL(formData.image) : ''} alt="出品物の画像" className="confirmation-item-image" />

        <h2 className="confirmation-item-title">{formData.name}</h2>
        <p className="confirmation-item-description">{formData.description}</p>

        <div className="confirmation-transaction-details">
          <div className="confirmation-transaction-method-label">
            希望取引方法：
            <span className="confirmation-transaction-method">
              {formData.transactionMethods.join(' / ')}
            </span>
          </div>
          <div className="confirmation-location-label">
            受け渡し場所：<span className="confirmation-location">{formData.location}</span>
          </div>
        </div>

        <p className="confirmation-instruction-text">
          この内容でよろしければ<br />出品するボタンを押してください
        </p>

        <div className="confirmation-button-container">
          <button className="confirmation-submit-button" onClick={handleSubmit}>出品する</button>
          <button className="confirmation-edit-button" onClick={handleEdit}>修正する</button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

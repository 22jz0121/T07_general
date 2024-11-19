import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import '../css/ProfileEditPage.css';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [num, setNum] = useState('');

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem(`profile-${userId}`));
    if (storedProfile) {
      setName(storedProfile.name || '');
      setBio(storedProfile.bio || '');
      setAvatar(storedProfile.avatar || 'https://source.unsplash.com/random/100x100?profile');
      setNum(storedProfile.num || '');
    }
  }, [userId]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setAvatar(imageURL);
    }
  };

  const handleNumChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[0-9]{0,2}[A-Z]{0,2}[0-9]{0,4}$/.test(value) && value.length <= 8) {
      setNum(value);
    }
  };

  const handleSave = () => {
    const updatedProfile = { name, bio, avatar, num };
    localStorage.setItem(`profile-${userId}`, JSON.stringify(updatedProfile));
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="profile-edit-page">
      {/* Header */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">プロフィールを編集</h1>
      </div>

      {/* Avatar Section */}
      <div className="avatar-editor">
        <img src={avatar} alt="Avatar" className="avatar-preview" />
        <label htmlFor="avatar-upload" className="avatar-upload-label">
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
          アイコンを変更
        </label>
      </div>

      {/* Editable Fields */}
      <div className="edit-fields">
        <label className="edit-label">
          名前
          <input
            type="text"
            className="edit-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
          />
        </label>
        <label className="edit-label">
          学籍番号
          <input
            type="text"
            className="edit-input"
            value={num}
            onChange={handleNumChange}
            placeholder="例: 12AB3456"
          />
        </label>
        <label className="edit-label">
          プロフィール
          <textarea
            className="edit-input bio-input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="プロフィール文を入力"
          />
        </label>
      </div>

      {/* Save Button */}
      <button className="save-button" onClick={handleSave}>
        <SaveIcon /> 保存
      </button>
    </div>
  );
};

export default ProfileEditPage;

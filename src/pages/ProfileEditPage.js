import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import '../css/ProfileEditPage.css';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [icon, setIcon] = useState('');
  const [imagedata, setImagedata] = useState(null);


  useEffect(() => {
    if (sessionStorage.getItem('MyID')) {
      setName(sessionStorage.getItem('MyName'));
      setComment(sessionStorage.getItem('MyComment') || '');
      setIcon(sessionStorage.getItem('MyIcon') || 'https://source.unsplash.com/random/100x100?profile');
    }
  }, [userId]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setIcon(imageURL);
      setImagedata(file);
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = { 'UserName':name, 'Comment':comment, 'Icon':imagedata };
      const response = await fetch(`https://loopplus.mydns.jp/api/user/${userId}`, {
        method: 'PUT',
        body: updatedProfile,
        credentials: 'include', // 必要に応じてクッキーを送信
      });
      const data = await response.json(); // JSONデータを取得

      navigate(`/profile/${userId}`);
      
    } catch (error) {
      console.error('Fetchエラー:', error);
    }
  }

  const imageSrc = icon.startsWith('storage/images/') ? `https://loopplus.mydns.jp/${icon}` : icon;

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
        <img src={imageSrc} alt="Avatar" className="avatar-preview" />
        <label htmlFor="avatar-upload" className="avatar-upload-label">
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleIconChange}
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
          プロフィール
          <textarea
            className="edit-input bio-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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

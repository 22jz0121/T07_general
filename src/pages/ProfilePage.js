import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemList from '../components/ItemList';
import RequestList from '../components/RequestList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get the userId from the URL
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [headerImage, setHeaderImage] = useState(''); // Header image state
  const [activeTab, setActiveTab] = useState('listing'); // State for active tab

  useEffect(() => {
    const currentUserId = '123'; // Replace with actual authentication logic
    setIsCurrentUser(userId === currentUserId);

    // Fetch profile from localStorage or default values
    const storedProfile = JSON.parse(localStorage.getItem(`profile-${userId}`));
    if (storedProfile) {
      setUserProfile(storedProfile);
    } else {
      const defaultProfile = {
        id: userId,
        name: userId === currentUserId ? 'あなたの名前' : '他のユーザー',
        bio: 'すがわら だいすけです。ずんだ餅が好きです',
        avatar: 'https://source.unsplash.com/random/100x100?profile',
        num: '12AB3456', // Default student number
      };
      setUserProfile(defaultProfile);
    }

    // Retrieve header image from localStorage
    const savedHeaderImage = localStorage.getItem(`headerImage-${userId}`);
    setHeaderImage(savedHeaderImage || 'https://source.unsplash.com/random/600x200?nature');
  }, [userId]);

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Convert file to a temporary URL
      setHeaderImage(imageURL); // Update header image
      localStorage.setItem(`headerImage-${userId}`, imageURL); // Save to localStorage
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profile-page">
      {/* Top Navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">{isCurrentUser ? 'プロフィール' : 'ユーザー情報'}</h1>
      </div>

      {/* Cover Image */}
      <div className="cover-image-container">
        <img src={headerImage} alt="Cover" className="cover-image" />
        {isCurrentUser && (
          <label htmlFor="header-image-upload" className="header-upload-label">
            <CameraAltIcon className="upload-icon" />
            <input
              id="header-image-upload"
              type="file"
              accept="image/*"
              onChange={handleHeaderImageChange}
              style={{ display: 'none' }}
            />
          </label>
        )}
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={userProfile.avatar}
          alt="Avatar"
          className="profile-header-avatar"
        />
        <div className="profile-header-details">
          <div className="profile-header-div">
            <h2 className="profile-header-name">{userProfile.name}</h2>
            {isCurrentUser && (
              <button
                className="profile-header-edit-button"
                onClick={() => navigate(`/profile-edit/${userId}`)}
              >
                <EditIcon /> 編集
              </button>
            )}
          </div>
          <p className="profile-header-num">@{userProfile.num}</p>
          <p className="profile-header-bio">{userProfile.bio}</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'listing' ? 'active' : ''}`}
          onClick={() => handleTabClick('listing')}
        >
          出品物一覧
        </button>
        <button
          className={`tab ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => handleTabClick('request')}
        >
          リクエスト
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'listing' ? (
          <ItemList userId={userId} />
        ) : (
          <RequestList userId={userId} showPostButton={false} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Item from '../components/Item';
import RequestList from '../components/RequestList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get the userId from the URL
  const [userProfile, setUserProfile] = useState({});
  const [headerImage, setHeaderImage] = useState(''); // Header image state
  const [activeTab, setActiveTab] = useState('listing'); // State for active tab
  const isCurrentUser = useRef(true);
  const isMounted = useRef(true);
  const [items, setItems] = useState([]);  
  const [myFavoriteIds, setMyFavoriteIds] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    isMounted.current = true;
    const fetchUserProfile = async (userId) => {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/user/${userId}`);
        const data = await response.json(); // JSONデータを取得
        setUserProfile(data); // データをセット
        setItems(data.Items);
        console.log(data.Items);
      } catch (error) {
        console.error('Fetchエラー:', error);
      }
    }

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
          setMyFavoriteIds(data.map(item => item.ItemID));
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    // Retrieve header image from localStorage
    if(!userProfile.ProfilePicture) {
      setHeaderImage(`https://loopplus.mydns.jp/${userProfile.ProfilePicture}`);
    }
    else{
      setHeaderImage('https://source.unsplash.com/random/600x200?nature');
    }

    fetchUserProfile(userId);
    fetchMyFavorites();

    return () => {
      isMounted.current = false; // アンマウント時にフラグを更新
    };
  }, []);

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Convert file to a temporary URL
      setHeaderImage(imageURL); // Update header image
      // localStorage.setItem(`headerImage-${userId}`, imageURL); // Save to localStorage
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //お気に入りボタンが押されたときの処理
  const handleLike = (itemId) => {
    console.log('handleLike called with itemId:', itemId);
    const isLiked = likedItems.includes(itemId);
    const isMyFavorite = myFavoriteIds.includes(itemId); // /myfavoriteから取得したIDと比較

    // DELETEかPOSTかを判断し切り替え処理へ
    const method = isMyFavorite ? 'DELETE' : 'POST';
    sendFavoriteRequest(itemId, method);

    // likedItemsの更新
    setLikedItems((prevLikedItems) => {
      return isLiked ? prevLikedItems.filter(id => id !== itemId) : [...prevLikedItems, itemId];
    });
  };


  //お気に入り切り替え処理
  const sendFavoriteRequest = async (itemId, method) => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/favorite/change/${itemId}`, {
        method: method,
        credentials: 'include',
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
          src={userProfile.Icon}
          alt="Avatar"
          className="profile-header-avatar"
        />
        <div className="profile-header-details">
          <div className="profile-header-div">
            <h2 className="profile-header-name">{userProfile.Username}</h2>
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
          <div>
            {items.map(item => (
              <Item 
                key={item.ItemID} 
                name={userProfile.Username ? userProfile.Username : '不明'} // ユーザー名を渡す
                userIcon={userProfile ? userProfile : 'default-icon-url.jpg'}
                itemId={item.ItemID} 
                title={item.ItemName} 
                imageSrc={`https://loopplus.mydns.jp/${item.ItemImage}`}
                description={item.Description} 
                onLike={handleLike}
                liked={myFavoriteIds.includes(item.ItemID)}
              />
            ))}
          </div>
        ) : (
          <RequestList userId={userId} showPostButton={false} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

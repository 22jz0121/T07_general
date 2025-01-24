import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Item from '../components/Item';
import RequestItem from '../components/RequestItem';
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
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const isMounted = useRef(true);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myFavoriteIds, setMyFavoriteIds] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const myId = parseInt(sessionStorage.getItem('MyID'), 10);
  const myName = sessionStorage.getItem('MyName');
  const myIcon = sessionStorage.getItem('MyIcon');
  const myProf = sessionStorage.getItem('MyProfPic');
  const myMail = sessionStorage.getItem('MyMail');
  const myComment = sessionStorage.getItem('MyComment');
  const [selectedTradeFlag, setSelectedTradeFlag] = useState(0);

  useEffect(() => {
    isMounted.current = true;

    console.log(myProf);

    //自分のページか判定
    if (userId == myId) {
      setIsCurrentUser(true);
    }

    if (myId && userId == myId) {
      setUserProfile({
        Username: myName,
        Icon: myIcon,
        Email: myMail,
        Comment: myComment,
        ProfilePicture: myProf,
      });
      setHeaderImage(`https://loopplus.mydns.jp/${userProfile.ProfilePicture}`);
    }

    fetchUserProfile(userId);
    fetchMyFavorites();

    return () => {
      isMounted.current = false; // アンマウント時にフラグを更新
    };
  }, []);


  //--------------------------------------------------
  //　　　　　　ユーザー情報取得
  //---------------------------------------------------
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/user/${userId}`);
      const data = await response.json(); // JSONデータを取得
      setUserProfile(data); // データをセット
      setItems(data.Items);
      setRequests(data.Requests);

      //ヘッダー画像の先頭部分判定(正直いらない)
      const image = data.ProfilePicture.startsWith('storage/images/')
        ? `https://loopplus.mydns.jp/${data.ProfilePicture}`
        : data.ProfilePicture;
      setHeaderImage(image);

      console.log(data.Items);
    } catch (error) {
      console.error('Fetchエラー:', error);
    }
  }




  //--------------------------------------------------
  //　　　　　　自分のお気に入りを取得
  //---------------------------------------------------
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



  //--------------------------------------------------
  //　　　　　　画像ファイルをbase64形式に変換
  //---------------------------------------------------
  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read the file.'));
      };
      reader.readAsDataURL(file);
    });
  }



  //--------------------------------------------------
  //　　　　　　アイテム削除時処理
  //---------------------------------------------------
  const handleDeleteItem = async (itemId) => {
    console.log("削除するアイテムのID:", itemId);

    // ユーザーに削除の確認を求める
    const confirmDelete = window.confirm(`この出品物を削除しますか？`);
    if (!confirmDelete) {
      alert('削除がキャンセルされました。');
      return;
    }

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TradeFlag: 3 }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('出品物の更新中にエラーが発生しました:', errorData);
        throw new Error('サーバーで出品物の削除に失敗しました');
      }

      setItems((prevItems) => prevItems.filter((item) => item.ItemID !== itemId));
      alert(`出品物が削除されました。`);
    } catch (error) {
      console.error('出品物の削除中にエラーが発生しました:', error);
      alert('出品物の削除に失敗しました。');
    }
  };



  //--------------------------------------------------
  //　　　　　　ProfilePicture(ヘッダー画像)を変更
  //---------------------------------------------------
  const handleHeaderImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setHeaderImage(imageURL);

      const base64 = await convertToBase64(file);
      const updatedProfile = { 'ProfilePicture': base64 };

      const response = await fetch(`https://loopplus.mydns.jp/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
        credentials: 'include', // 必要に応じてクッキーを送信
      });
      if (!response.ok) {
        alert('対応していない形式の画像\nもしくは容量が大きすぎます。')
      }
      const data = await response.json(); // JSONデータを取得
      if (data.status == 'success') {
        sessionStorage.setItem('MyProfPic', data.ProfilePicture);
      }
    }
  };



  //--------------------------------------------------
  //　　　　　　タブ切り替え(出品物/リクエスト)処理
  //---------------------------------------------------
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };




  //--------------------------------------------------
  //　　　　　　お気に入りボタンが押されたときの処理
  //---------------------------------------------------
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


  //--------------------------------------------------
  //　　　　　　お気に入り切り替え処理
  //---------------------------------------------------
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



  //--------------------------------------------------
  //　　　　　　リクエスト削除処理
  //---------------------------------------------------
  const handleDeleteRequest = async (requestId) => {
    console.log("削除するリクエストのID:", requestId);

    // ユーザーに削除の確認を求める
    const confirmDelete = window.confirm(`このリクエストを削除しますか？`);
    if (!confirmDelete) {
      alert('削除がキャンセルされました。');
      return; // ユーザーがキャンセルした場合は処理を終了
    }

    try {
      // サーバーでDisplayFlagを0に更新するためのAPI呼び出しを行う
      const response = await fetch(`https://loopplus.mydns.jp/api/request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DisplayFlag: 0 }),
        credentials: 'include', // 必要に応じてクッキーを送信する
      });

      if (!response.ok) {
        const errorData = await response.json(); // エラー応答をログに記録
        console.error('リクエストの更新中にエラーが発生しました:', errorData);
        throw new Error('サーバーでリクエストの削除に失敗しました');
      }

      // サーバーが更新を確認した後、ローカルの状態を更新
      setRequests((prevRequests) => {
        const updatedRequests = prevRequests.map((request) =>
          request.RequestID === requestId ? { ...request, DisplayFlag: 0 } : request
        );

        alert(`リクエストが削除されました。`);
        return updatedRequests;
      });
    } catch (error) {
      console.error('リクエストの削除中にエラーが発生しました:', error);
      alert('リクエストの削除中にエラーが発生しました。');
    }
  };



  //--------------------------------------------------
  //　　　　　　アイコンパス処理
  //---------------------------------------------------
  const iconSrc = userProfile.Icon && userProfile.Icon.startsWith('storage/images/')
    ? `https://loopplus.mydns.jp/${userProfile.Icon}`
    : userProfile.Icon;



  //--------------------------------------------------
  //　　　　　　絞り込み処理
  //---------------------------------------------------
  const handleTradeFlagChange = (event) => {
    setSelectedTradeFlag(Number(event.target.value)); // 選択されたトレードフラグを設定
  };

  const filteredItems = items.filter(item => item.TradeFlag === selectedTradeFlag);




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
        {isCurrentUser ? (
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
        ) : null}
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={iconSrc}
          alt="Avatar"
          className="profile-header-avatar"
        />
        <div className="profile-header-details">
          <div className="profile-header-div">
            <h2 className="profile-header-name">{userProfile.Username}</h2>
            {isCurrentUser ? (
              <button
                className="profile-header-edit-button"
                onClick={() => navigate(`/profile-edit/${userId}`)}
              >
                <EditIcon /> 編集
              </button>
            ) : null}
          </div>
          <p className="profile-header-num">@{userProfile.Email}</p>
          <p className="profile-header-bio">{userProfile.Comment}</p>
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

      <div className="tab-content">
        {activeTab === 'listing' ? (
          <div>
            <div className="pulls-container">
              <select id="tradeFlag" value={selectedTradeFlag} onChange={handleTradeFlagChange}>
                <option value={0}>出品中</option>
                <option value={1}>取引中</option>
                <option value={2}>取引完了</option>
              </select>
            </div>
            {filteredItems.length > 0 ? (
              filteredItems
                .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
                .map((item) => (
                  <Item
                    key={item.ItemID}
                    itemId={item.ItemID}
                    userId={item.UserID}
                    name={userProfile.Username || '不明'}
                    time={item.CreatedAt}
                    imageSrc={`https://loopplus.mydns.jp/${item.ItemImage}`}
                    title={item.ItemName}
                    description={item.Description}
                    onLike={handleLike}
                    liked={myFavoriteIds.includes(item.ItemID)}
                    userIcon={userProfile.Icon}
                    tradeFlag={item.TradeFlag}
                    transactionMethods={item.TradeMethod ? [item.TradeMethod] : []}
                    showDeleteButton={myId === parseInt(item.UserID, 10)}
                    onDelete={myId === parseInt(item.UserID, 10) ? handleDeleteItem : undefined}
                  />
                ))
            ) : (
              <p className="no-transactions">出品物はありません。</p>
            )}

          </div>
        ) : (
          <div>
            {requests.filter(request => request.DisplayFlag === 1).length > 0 ? (
              requests
                .filter(request => request.DisplayFlag === 1)
                .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
                .map(request => (
                  <RequestItem
                    key={request.RequestID}
                    id={request.RequestID}
                    name={userProfile.Username ? userProfile.Username : '不明'}
                    time={request.CreatedAt}
                    imageSrc={request.RequestImage}
                    content={request.RequestContent}
                    userIcon={userProfile.Icon}
                    onDelete={myId === parseInt(request.UserID, 10) ? handleDeleteRequest : undefined} // Only pass onDelete if the user matches
                    showDeleteButton={myId === parseInt(request.UserID, 10)} // Pass this prop to show or hide the delete button
                  />
                ))
            ) : (
              <p className='no-transactions'>リクエストはありません。</p>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

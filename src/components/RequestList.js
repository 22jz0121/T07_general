import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  // Import AccountCircle for avatars
import { Reply as ReplyIcon } from '@mui/icons-material';  // Import Material UI Reply icon
import tvImage from '../img/tv-image.png';  // Import request item image
import PostButton from './PostButton';  // Ensure the PostButton component is correctly imported
import '../css/RequestPage.css';  // Assuming this CSS file has the necessary styles

function RequestItem({ name, time, description, imageSrc }) {
  const handleReplyClick = () => {
    alert(`Replying to ${name}`);
  };

  return (
    <div className="request-item">
      <div className="profile">
        <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} /> {/* Use Material UI Icon instead of image */}
        <div className="profile-info">
          <span className="name">{name}</span>
          <span className="time">{time}</span>
        </div>
      </div>
      <div className="content">
        <p>{description}</p>
        {imageSrc && <img src={imageSrc} alt="Request" className="request-image" />}
      </div>
      {/* Reply Button */}
      <ReplyIcon className="reply-icon" onClick={handleReplyClick} />
    </div>
  );
}

function RequestList() {
  return (
    <div className="request-list">
      {/* Request items */}
      <RequestItem
        name="電子太郎"
        time="12時間前"
        description="最新の4K対応で、55インチのスマートテレビが欲しいなあ。高画質で映画とかゲームを楽しみたいし、音質もいいモデルがいいなあ。あと、AIアシスタントが搭載されてたら嬉しい！"
      />
      <RequestItem
        name="日本電子"
        time="3秒前"
        description="お前が欲しい"
        imageSrc={tvImage}
      />
      <RequestItem
        name="電子太郎"
        time="1日前"
        description="最新の4K対応で、55インチのスマートテレビが欲しいなあ。高画質で映画とかゲームを楽しみたいし、音質もいいモデルがいいなあ。あと、AIアシスタントが搭載されてたら嬉しい！"
      />

      {/* Post Button */}
      <PostButton />
    </div>
  );
}

export default RequestList;

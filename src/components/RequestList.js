import React from 'react';
import { Reply as ReplyIcon } from '@mui/icons-material';  // Import Material UI Reply icon
import avatar1 from '../img/avatar1.png';  // Import avatar image
import tvImage from '../img/tv-image.png';  // Import request item image
import PostButton from './PostButton';  // Ensure the PostButton component is correctly imported
import '../css/RequestPage.css';  // Assuming this CSS file has the necessary styles

function RequestItem({ avatar, name, time, description, imageSrc }) {
  const handleReplyClick = () => {
    alert(`Replying to ${name}`);
  };

  return (
    <div className="request-item">
      <div className="profile">
        <img src={avatar} alt="Avatar" className="avatar" />
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
        avatar={avatar1}
        name="電子太郎"
        time="12時間前"
        description="最新の4K対応で、55インチのスマートテレビが欲しいなあ。高画質で映画とかゲームを楽しみたいし、音質もいいモデルがいいなあ。あと、AIアシスタントが搭載されてたら嬉しい！"
      />
      <RequestItem
        avatar={avatar1}
        name="日本電子"
        time="3秒前"
        description="お前が欲しい"
        imageSrc={tvImage}
      />
      <RequestItem
        avatar={avatar1}
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

// src/components/RequestList.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Reply as ReplyIcon } from '@mui/icons-material';
import tvImage from '../img/tv-image.png';
import PostButton from './PostButton';
import '../css/RequestPage.css';

function RequestItem({ id, name, time, description, imageSrc }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/request/${id}`);
  };

  return (
    <div className="request-item" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="profile">
        <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
        <div className="profile-info">
          <span className="name">{name}</span>
          <span className="time">{time}</span>
        </div>
      </div>
      <div className="content">
        <p>{description}</p>
        {imageSrc && <img src={imageSrc} alt="Request" className="request-image" />}
      </div>
      <ReplyIcon className="reply-icon" />
    </div>
  );
}

function RequestList() {
  return (
    <div className="request-list">
      <RequestItem
        id="1"
        name="電子太郎"
        time="12時間前"
        description="最新の4K対応で、55インチのスマートテレビが欲しいなあ。高画質で映画とかゲームを楽しみたいし、音質もいいモデルがいいなあ。あと、AIアシスタントが搭載されてたら嬉しい！"
      />
      <RequestItem
        id="2"
        name="日本電子"
        time="3秒前"
        description="お前が欲しい"
        imageSrc={tvImage}
      />
      <RequestItem
        id="3"
        name="電子太郎"
        time="1日前"
        description="最新の4K対応で、55インチのスマートテレビが欲しいなあ。高画質で映画とかゲームを楽しみたいし、音質もいいモデルがいいなあ。あと、AIアシスタントが搭載されてたら嬉しい！"
      />
      <PostButton />
    </div>
  );
}

export default RequestList;

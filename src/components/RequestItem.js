import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PostButton from './PostButton';
import '../css/RequestPage.css';

function RequestItem({ id, name, time, content, imageSrc, userIcon }) {

  const iconSrc = userIcon && userIcon.startsWith('storage/images/') 
    ? `https://loopplus.mydns.jp/${userIcon}` 
    : userIcon;

  
  return (
    <div className="request-item">
      <Link
        to={`/request/${id}`}
        state={{ id, name, time, content, imageSrc}} // stateを利用
        className="request-link"
      >
        <div className="profile">
          {userIcon ? (
              <img src={iconSrc} alt="User Icon" className="avatar-icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          ) : (
              <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
          )}
          <div className="profile-info">
            <span className="name">{name}</span>
            <span className="time">{new Date(time).toLocaleDateString()} {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <div className="content">
          <p>{content}</p>
          {imageSrc && <img src={imageSrc} alt="Request" className="request-image" />}
        </div>
      </Link>
    </div>
  );
}

export default RequestItem;

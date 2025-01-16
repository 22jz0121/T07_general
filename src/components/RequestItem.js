import React from 'react';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import '../css/RequestPage.css';

function RequestItem({ id, userId, name, time, content, imageSrc, userIcon, onDelete, showDeleteButton }) {
  const iconSrc = userIcon && userIcon.startsWith('storage/images/')
    ? `https://loopplus.mydns.jp/${userIcon}`
    : userIcon;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="request-item">
      <Link
        to={`/request/${id}`}
        state={{ id, userId, name, time, content, imageSrc, userIcon }}
        className="request-link"
      >
        <Link to={`/profile/${userId}`} className="link">
          <div className="profile">
            {userIcon ? (
              <img src={iconSrc} alt="User Icon" className="avatar-icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
            ) : (
              <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
            )}
            <div className="profile-info">
              <span className="name">{name}</span>
              <span className="time">{formatDate(time)}</span>
            </div>
          </div>
        </Link>
        <div className="content">
          <p className='content-ppp'>{content}</p>
          {imageSrc && <img src={imageSrc} alt="Request" className="request-image" />}
        </div>
      </Link>
      {showDeleteButton && onDelete && (
        <IconButton onClick={() => onDelete(id)} aria-label="delete" className="delete-button">
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
}

export default RequestItem;

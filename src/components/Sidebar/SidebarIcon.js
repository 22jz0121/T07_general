import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function SidebarIcon({ userImage, userName }) {
  return (
    <div className='SidebarIcon'>
      {userImage ? (
        <img
          src={`https://loopplus.mydns.jp/${userImage}`} // userImageを使用
          alt="User Icon"
          className="avatar-icon"
          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
        />
      ) : (
        <AccountCircleIcon style={{ fontSize: 40 }} />
      )}
      <span>{userName}</span>
    </div>
  );
}

export default SidebarIcon;

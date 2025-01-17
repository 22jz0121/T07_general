import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserTable.css';
import { Tooltip } from '@mui/material';
import GppGoodIcon from '@mui/icons-material/GppGood';
import BlockIcon from '@mui/icons-material/Block'; 
import WarningIcon from '@mui/icons-material/Warning';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [viewAdmins, setViewAdmins] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://loopplus.mydns.jp/user');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setUsers(data);
    };
    fetchData();
  }, []);

  const sendWarning = (e, userId) => {
    e.stopPropagation();
    navigate(`/user-warning/${userId}`);
  };

  const banUser = async (e, userId, isBanned) => {
    e.stopPropagation();
    const confirmMessage = isBanned
      ? 'このユーザーのBANを解除しますか？'
      : 'このユーザーをBANしますか？';

    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/user/${userId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ BanFlag: isBanned ? 0 : 1 }),
        });

        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);

        const data = await response.json();
        if (data.status === 'success') {
          alert(isBanned ? 'BANが解除されました。' : 'ユーザーがBANされました。');
          setUsers((prev) =>
            prev.map((user) =>
              user.UserID === userId ? { ...user, BanFlag: isBanned ? 0 : 1 } : user
            )
          );
        } else {
          alert(`処理に失敗しました: ${data.message}`);
        }
      } catch (error) {
        alert('処理中にエラーが発生しました。');
      }
    }
  };

  const handleRowClick = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  const toggleAdminStatus = async (e, userId, currentAdminFlag) => {
    e.stopPropagation();
    if (window.confirm(`このユーザーを${currentAdminFlag === 1 ? '一般ユーザー' : '管理者'}に変更しますか？`)) {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/api/user/${userId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ AdminFlag: currentAdminFlag === 1 ? 0 : 1 }),
        });

        if (!response.ok) throw new Error(`HTTPエラー: ${response.status}`);

        const data = await response.json();
        if (data.status === 'success') {
          alert('ユーザーの管理者状態が変更されました。');
          setUsers((prev) =>
            prev.map((user) =>
              user.UserID === userId ? { ...user, AdminFlag: currentAdminFlag === 1 ? 0 : 1 } : user
            )
          );
        } else {
          alert(`管理者変更に失敗しました: ${data.message}`);
        }
      } catch (error) {
        alert('管理者状態変更中にエラーが発生しました。');
      }
    }
  };

  const filteredUsers = users
    .filter((user) => {
      if (viewAdmins === 'admins') return user.AdminFlag === 1;
      if (viewAdmins === 'users') return user.AdminFlag === 0;
      return true; // 'all'の場合は全ユーザー
    })
    .filter((user) => user.Email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="search-container">
        <div className="user-type-selector">
          <p>表示切り替え：</p>
          <select onChange={(e) => setViewAdmins(e.target.value)}>
            <option value="all">全ユーザー表示</option>
            <option value="users">ユーザー一覧表示</option>
            <option value="admins">管理者一覧表示</option>
          </select>
        </div>
        <div className="search-move-right">
          <input
            type="text"
            placeholder="メールアドレスで検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '5px', marginRight: '10px', width: '200px' }}
          />
          <SearchIcon style={{ color: '#757575', cursor: 'pointer' }} />
        </div>
      </div>

      <table className="fixed-tbody">
        <thead>
          <tr>
            <th className="fixed-th">ユーザーID</th>
            <th className="fixed-th">ユーザー名</th>
            <th className="fixed-th">メールアドレス</th>
            <th className="fixed-th">管理者変更</th>
            <th className="fixed-th">警告</th>
            <th className="fixed-th">BAN</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                読み込み中です。しばらくお待ちください。
              </td>
            </tr>
          ) : (
            filteredUsers.map((user, index) => (
              <tr
                key={user.UserID}
                onClick={() => handleRowClick(user.UserID)}
                className={index % 2 === 0 ? 'even-row' : ''}
              >
                <td>{user.UserID}</td>
                <td>{user.Username}</td>
                <td>{user.Email}</td>
                <td>
                  <button onClick={(e) => toggleAdminStatus(e, user.UserID, user.AdminFlag)}>
                    {user.AdminFlag === 1 ? (
                      <AdminPanelSettingsIcon style={{ color: '#01ff01' }} />
                    ) : (
                      <PersonAddIcon style={{ color: 'white' }} />
                    )}
                  </button>
                </td>
                <td>
                  <button onClick={(e) => sendWarning(e, user.UserID)}>
                    <WarningIcon />
                  </button>
                </td>
                <td>
                  <button onClick={(e) => banUser(e, user.UserID, user.BanFlag)}>
                    <Tooltip title={user.BanFlag === 1 ? 'BAN解除' : 'BANする'}>
                      {user.BanFlag === 1 ? (
                        <BlockIcon style={{ color: 'red' }} />
                      ) : (
                        <GppGoodIcon style={{ color: 'white' }} />
                      )}
                    </Tooltip>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

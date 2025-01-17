import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import './UserWarning.css';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const UserWarning = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [warningContent, setWarningContent] = useState('');

  // ユーザー情報を取得する
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/user/${userId}`);
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }
        const userData = await response.json();
        
        setUser(userData);
        console.log(userData);
      } catch (error) {
        console.error(error);
        alert('ユーザー情報の取得に失敗しました。');
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!warningContent) {
      alert('警告内容を入力してください');
      return;
    }
  
    // 確認ポップアップを表示
    const confirmSend = window.confirm('本当に警告を送信しますか？');
    if (!confirmSend) {
      return; // ユーザーがキャンセルした場合は処理を中断
    }
  
    try {
      const response = await fetch('https://loopplus.mydns.jp/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: userId, 
          Content: `あなたは警告されました!\n理由：${warningContent}`,
          WarnFlag: 1,
        }),
      });
  
      if (!response.ok) {
        throw new Error('警告の送信に失敗しました');
      }
      alert(`警告を送信しました!`);
      setWarningContent('');
    } catch (error) {
      console.error(error);
      alert('警告の送信に失敗しました。');
    }
  };
  
  

  return (
    <div>
      <Navbar />
      <div className="userWarningContainer">
        <Sidebar />
        <div className="userWarningContent">
          <div className='userwarning-container'>
            <div className='title-warning'>
              <WarningAmberOutlinedIcon fontSize="large" style={{ marginLeft: '10px' }}/> 
              <p>ユーザー警告</p>
            </div>
            <div>
              {user && (
                <div className="userInfo">
                  <p>ユーザー名: <strong>{user.Username}</strong></p>
                  <p>メールアドレス: <strong>{user.Email}</strong></p>
                </div>
              )}

              <form className='form-userwarning' onSubmit={handleSubmit}>
                <div className='userWarningForm'>
                  <label style={{ marginLeft: '10px' }}>警告内容 </label>
                  <textarea
                    value={warningContent}
                    onChange={(e) => setWarningContent(e.target.value)} 
                    placeholder="警告内容を入力してください"
                    required
                  /><br />
                  
                </div>
                
                <div className='userwarning-button'>
                  <button type="submit">警告する</button>
                </div>
              
              </form>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWarning;

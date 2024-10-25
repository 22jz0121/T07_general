import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import '../css/top.css';

function TabBar() {
  const navigate = useNavigate();  // Initialize the navigation hook

  return (
    <div className="tab-bar">
      <button className="tab" onClick={() => navigate('/')}>出品物一覧</button>  {/* Navigate to "/" */}
      <button className="tab" onClick={() => navigate('/request')}>リクエスト</button>
    </div>
  );
}

export default TabBar;

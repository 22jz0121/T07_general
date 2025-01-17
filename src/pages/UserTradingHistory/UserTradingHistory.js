import React from 'react';
import './UserTradingHistory.css';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchBar from '../../components/SearchBar/SearchBar';
import Profile from '../../components/Profile/Profile';

// 仮の取引データ
const transactions = [
  {
    id: 1,
    sender: '田中 太郎',
    recipient: '鈴木 次郎',
    product: 'スマホ',
    location: '12号館',
    method: '譲渡',
    time: '2024-10-20 ',
    status: '取引中',
  },
  {
    id: 2,
    sender: '鈴木 次郎',
    recipient: '田中 太郎',
    product: 'イヤフォン',
    location: '1号館',
    method: 'レンタル',
    time: '2024-10-20 ',
    status: '完了',
  },
  {
    id: 3,
    sender: '田中 太郎',
    recipient: '鈴木 次郎',
    product: 'ノートパソコン',
    location: '７号館',
    method: '譲渡',
    time: '2024-10-20 ',
    status: '完了',
  },
  {
    id: 4,
    sender: '鈴木 次郎',
    recipient: '田中 太郎',
    product: 'ゲーム機',
    location: '1号館',
    method: '譲渡',
    time: '2024-10-20 ',
    status: '完了',
  },
];

function UserTradingHistory() {
  return (
    <div>
      <Navbar />
      <div className='columnBrake'>
        <Sidebar />
        <div className='mainbody'>
          <h1>取引履歴一覧</h1>
          <Profile />
          <div className='trading-list'>
            <ul className="list">
              {transactions.map(transaction => (
                <li key={transaction.id} className={`card ${transaction.sender === '田中 太郎' ? 'your' : 'other'}`}>
                  <div className="details">
                    <div className='seder-time'>
                      <strong><p className="sender">{transaction.sender} → {transaction.recipient}</p></strong>
                      <span className="time">{transaction.time}</span>
                    </div>
                    <p className="product">商品: {transaction.product}</p>
                    <p className="location">場所: {transaction.location}</p>
                    <p className="method">方法: {transaction.method}</p>
                    <p className={`status ${transaction.status === '進行中' ? 'ongoing' : 'completed'}`}>
                      ステータス: {transaction.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserTradingHistory;

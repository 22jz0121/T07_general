import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigateをインポート
import Navbar from '../Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchBar from '../../components/SearchBar/SearchBar';
import './SearchResult.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function SearchResult() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate(); // navigateを取得
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    if (location.state && Array.isArray(location.state.results)) {
      setResults(location.state.results);
      console.log("検索結果:", location.state.results); // デバッグ用
    } else {
      console.log("検索結果がありません");
    }
    setLoading(false); // データの取得が終わったらローディングを終了
  }, [location.state]);

  if (loading) return <div className="loading"><img src="/Loading.gif" alt="Loading" /></div>;

  // 商品詳細画面に遷移する関数
  const handleItemClick = (itemId) => {
    navigate('/product-detail', { state: { itemId } }); // 商品IDを渡して遷移
  };

  return (
    <div>
      <Navbar />
      <div className='columnBrake'>
        <Sidebar />
        <div className='mainbody'>
          <div className='product-manager'>
            <h1>検索結果</h1>
            <div className='productitems'>
              {results.length > 0 ? (
                <ul>
                  {results.map((item) => (
                    <li key={item.ItemID} onClick={() => handleItemClick(item.ItemID)}> {/* クリック時に詳細ページへ遷移 */}
                      <div className="">
                        <div className="product-header">
                          {item.User ? (
                            <img
                              src={`https://loopplus.mydns.jp/${item.User.Icon}`}
                              alt="User Icon"
                              className="avatar-icon"
                              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                          ) : (
                            <AccountCircleIcon style={{ fontSize: 40 }} />
                          )}
                          <span className="username">
                            {item.User ? item.User.UserName : 'ユーザー名が取得できません'}
                          </span>
                          <span className="date">
                            {item.UpdatedAt ? (
                              new Date(item.UpdatedAt).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            ) : (
                              '日付情報なし'
                            )}
                          </span>
                          <br />
                        </div>

                        <div className='productdetails-flex'>
                          <div className='imagedetail-flex'>
                            <img
                              src={item.ItemImage ? `https://loopplus.mydns.jp/${item.ItemImage}` : 'default_image_url'}
                              alt={item.ItemName || 'アイテム名なし'}
                              className="productimage"
                            />
                            <div className="productdetails">
                              <div className='product-details-title'>
                                <h2>{item.ItemName || 'アイテム名なし'}</h2>
                                <p>{item.Description || '説明がありません'}</p> 
                              </div>
                            </div>
                          </div>

                          <div className='product-actions'>
                            <button onClick={() => alert('非表示にしました')}>非表示</button>
                            <button onClick={() => alert('取引が完了しました')}>取引完了</button>
                            <button onClick={() => alert('警告しました')}>警告する</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>検索結果がありません。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

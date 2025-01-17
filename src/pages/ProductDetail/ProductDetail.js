import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetail.css'; // スタイルシートのインポート
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null); // 商品情報の状態
  const [user, setUser] = useState(null); // ユーザー情報の状態
  const [loading, setLoading] = useState(true); // ローディング状態

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productId = location.state?.itemId;

      if (!productId) {
        alert('商品IDが取得できません。');
        setLoading(false);
        return; // 商品IDがない場合は処理を終了
      }

      try {
        // 商品詳細を取得するAPI
        const response = await fetch(`https://loopplus.mydns.jp/api/item/${productId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched product details:', data); // デバッグ用

        setProduct(data); // APIから取得したデータを設定

        // ユーザー情報を取得
        const userResponse = await fetch(`https://loopplus.mydns.jp/api/user/${data.UserID}`);
        if (!userResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await userResponse.json();
        console.log('Fetched user details:', userData); // デバッグ用

        setUser(userData); // ユーザー情報を設定
      } catch (error) {
        console.error('Error fetching product or user details:', error);
        alert('商品情報またはユーザー情報の取得に失敗しました。'); // エラーメッセージ
      } finally {
        setLoading(false); // ローディング完了
      }
    };

    fetchProductDetails();
  }, [location.state]);

  if (loading) return <div className="loading"><img src="/Loading.gif" alt="Loading" /></div>;

  if (!product) {
    return <p>商品情報が見つかりません。</p>; // 商品情報がない場合の表示
  }

  // 必要なデータを取得
  const {
    ItemID,
    ItemName,
    Description,
    ItemImage,
    UpdatedAt,
    TradeFlag // 追加: TradeFlagを取得
  } = product;

  // 非表示処理
  const handleHide = async () => {
    const confirmed = window.confirm('本当にこの商品を削除しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/${ItemID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TradeFlag: 3 }), // TradeFlagを3に設定
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('削除に失敗しました');
      }

      alert('商品が削除されました');
      navigate('/ListedProducts');
    } catch (error) {
      console.error('Error hiding product:', error);
      alert(error.message);
    }
  };

  // 取引完了処理
  const handleComplete = async () => {
    const confirmed = window.confirm('本当に取引を完了しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/${ItemID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TradeFlag: 2 }), // TradeFlagを2に設定
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('取引完了に失敗しました');
      }

      alert('取引が完了しました');
      navigate('/ListedProducts');
    } catch (error) {
      console.error('Error completing trade:', error);
      alert(error.message);
    }
  };

  // 警告処理
  const handleWarning = () => {
    navigate('/ProductWarning', { 
      state: {
        itemId: ItemID,
        username: user?.Username,
        productName: ItemName,
        productDetails: Description,
        productLocation: '',
        productImage: ItemImage,
        profileImage: user?.Icon,
        date: UpdatedAt,
        status: '',
      } 
    });
  };

  // 再表示処理
  const handleReShow = async () => {
    const confirmed = window.confirm('本当にこの商品を再表示しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/item/${ItemID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ TradeFlag: 0 }), // TradeFlagを0に設定
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('再表示に失敗しました');
      }

      alert('商品が再表示されました');
      navigate('/ListedProducts');
    } catch (error) {
      console.error('Error re-showing product:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='columnBrake'>
        <Sidebar />
        <div className='mainbody'>
          <div className='productmanager'>
          <div className='trade-status'>
              {TradeFlag === 0 && <p className='TradeFlag-p'>出品中</p>}
              {TradeFlag === 1 && <p className='TradeFlag-p'>取引中</p>}
              {TradeFlag === 2 && <p className='TradeFlag-p'>取引完了</p>}
              {TradeFlag === 3 && <p className='TradeFlag-p'>削除済み</p>}
            </div>
            <div className='productitem-scroll'>
              <div key={ItemID} className="productitem">
                <div className="product-header">
                  {user?.Icon ? (
                    <img
                      src={`https://loopplus.mydns.jp/${user.Icon}`}
                      alt="User Icon"
                      className="avatar-icon"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  ) : (
                    <AccountCircleIcon style={{ fontSize: 40 }} />
                  )}
                  <span className="username">{user?.Username ?? 'ユーザー名が取得できません'}</span>
                  <span className="date">
                    {UpdatedAt
                      ? new Date(UpdatedAt).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '日付情報なし'}
                  </span>
                  <br />
                </div>

                <div className='productdetails-flex'>
                  <div className='imagedetail-flex'>
                    <img src={`https://loopplus.mydns.jp/${ItemImage}`} alt={ItemName} className="productimage" />
                    <div className="productdetails">
                      <div className='product-details-title'>
                        <h2>{ItemName}</h2>
                        <p>{Description}</p>
                      </div>
                    </div>
                  </div>

                  <div className='product-actions'>
                    {TradeFlag === 0 && (
                      <>
                        <button onClick={handleHide}>削除</button>
                        <button onClick={handleComplete}>取引完了</button>
                        <button onClick={handleWarning}>警告する</button>
                      </>
                    )}
                    {TradeFlag === 1 && (
                      <>
                        <button onClick={handleComplete}>取引完了</button>
                      </>
                    )}
                    {TradeFlag === 2 && (
                        <>
                          <button onClick={handleReShow}>再表示</button>
                        </>
                        
                        )}
                    {TradeFlag === 3 && (
                      <>
                        <button onClick={handleReShow}>再表示</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

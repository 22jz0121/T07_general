import React, { useEffect } from 'react';

const Login = ({ setIsFooterVisible }) => {

  useEffect(() => {
    // フッターを非表示にする
    setIsFooterVisible(false);

    // クリーンアップ関数でフッターを再表示
    return () => setIsFooterVisible(true);
  }, [setIsFooterVisible]);

  const handleButtonClick = () => {
      window.location.href = 'https://loopplus.mydns.jp/login/google';
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <div className='login-form'>
          <h1>Loop+</h1>
          <div className='login-button'>
            <button onClick={handleButtonClick}>ロォグイィン！！</button>
          </div>
      </div>
    </div>
  );
};

export default Login;
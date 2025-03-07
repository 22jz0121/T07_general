import React, { useEffect } from 'react';
import '../css/login.css';

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
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <div className='login-form'>
        <img src='/Login_cat.gif'alt="gif" width="120" id="Login_gifs"></img>
        <img src='/logo.png' alt="Logo" width="100" id="logo"/>
        <div className='login-button'>
          <button onClick={handleButtonClick} >
            <img
              src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
              alt="Sign in with Google"
              style={{ border: 'none', borderRadius: '5px' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
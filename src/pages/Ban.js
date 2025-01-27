import React from 'react';
import '../css/ban.css';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function Ban() {
  return (
    <div class="container">
        <h1>アクセス禁止</h1>
        <p>申し訳ありませんが、あなたのアカウントはアクセスできません。</p>
        <p>利用停止されている、もしくはjecでないアカウントでログインしている可能性があります。</p>
        <p>詳細についてはサポートにお問い合わせください。</p>
        <div className="menu-item" onClick={() => window.location.href = 'https://forms.gle/4fm6jAafJ1APJYo69'}>
            <HelpOutlineIcon className="menu-icon" />
            <span className="menu-label">お問い合わせ</span>
        </div>
        <div className="menu-item" onClick={() => window.location.href = 'https://loopplus.mydns.jp/login'}>
            <span className="menu-label">ログインページへ</span>
        </div>
    </div>
  );
}

export default Ban;
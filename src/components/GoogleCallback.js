import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // トークンをローカルストレージに保存するなどの処理
      localStorage.setItem('authToken', token);
      navigate('/');  // ログイン後のページへリダイレクト
    } else {
      // トークンがない場合のエラーハンドリング
      alert('ログインに失敗しました');
      navigate('/login');
    }
  }, [navigate]);

  return <div>ログイン処理中...</div>;
}

export default GoogleCallback;

// src/pages/Top.js

import React, { useEffect } from 'react';
import TopSection from '../components/TopSection';
import Footer from '../components/Footer';
import '../css/top.css';

function Top() {

  const myId = parseInt(sessionStorage.getItem('MyID'), 10);

  useEffect(() => {
    if(!localStorage.getItem('Notification') && sessionStorage.getItem('Notification') == 'enable') {
      const result = window.confirm('LOOP+は通知を送信します。宜しいですか？');
      if (result) {
        localStorage.setItem('Notification', 'enable');
        getPushSubscription();
      } else {
        sessionStorage.setItem('Notification', 'disable');
      }
    }
  }, []);


  //プッシュ通知を使えるか判定
  const getPushSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert('このブラウザはプッシュ通知に対応していません');
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'denied' || permission === 'default') {
        alert('プッシュ通知が許可されていません。ブラウザの設定を変更してください');
        return;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_WEB_PUSH_VAPID_PUBLIC_KEY,
    });

    await saveSubscription(subscription); // サブスクリプションを保存
    alert('サブスクリプションが保存されました！');
  };

  //プッシュ通知のための情報を保存
  const saveSubscription = async (subscription) => {
    console.log(myId)
    try {
        const response = await fetch('https://loopplus.mydns.jp/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
                keys: subscription.toJSON().keys,
                user_id: myId, // ユーザーIDを追加
            }),
        });

        const data = await response.json();
        if (!data.success) {
            alert('サブスクリプションの保存に失敗しました。');
        }
    } catch (error) {
        console.error('エラー:', error);
        alert('エラーが発生しました。');
    }
  };

  return (
    <div>
      <TopSection />
      <Footer />
    </div>
  );
}

export default Top;

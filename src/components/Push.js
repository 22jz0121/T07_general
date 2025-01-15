import React, { useState } from 'react';

const Push = () => {
    const [messages, setMessages] = useState([]); // メッセージを保存する状態
    const myId = parseInt(sessionStorage.getItem('MyID'), 10);

    const handleClick = async () => {

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

        await getPushSubscription();
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

    //通知を送信
    const sendPushNotification = async () => {
        const userId = 3;
        const message = "ひぃぃぃぃやｈｈｈｈｈｈっはぁぁぁぁぁぁぁぁぁぁああああああああ！！！！！"; // 送信するメッセージ内容
        const url = "https://www.jec.ac.jp/?utm_source=g&utm_medium=kw&utm_campaign=lis&gad_source=1&gclid=CjwKCAiAhP67BhAVEiwA2E_9g8iHNceHOepij2pWdBNSAml-FiO5h0k4vf6TzO6jZmu7xA8D8cbRJxoC-MUQAvD_BwE"

        try {
            const response = await fetch('https://loopplus.mydns.jp/api/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, message, url }),
            });

            const data = await response.json();
            if (data.success) {
                alert('プッシュ通知が送信されました！');
                addMessageToDisplay(message); // メッセージを表示
            } else {
                alert('通知の送信に失敗しました。');
            }
        } catch (error) {
            console.error('エラー:', error);
            alert('エラーが発生しました。');
        }
    };

    //送った通知の内容を自分の画面に表示(テスト用)
    const addMessageToDisplay = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <>
            <button onClick={handleClick}>
                閲覧中のブラウザを登録
            </button>

            <button onClick={sendPushNotification}>
                プッシュ通知を送信
            </button>

            <div>
                <h2>受信したメッセージ</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: msg }} />
                    ))}
                </ul>
                <img src='/icon.svg' />
            </div>
        </>
    );
};

export default Push;

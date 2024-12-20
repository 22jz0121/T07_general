import React, { useState } from 'react';

const Push = () => {
    const [messages, setMessages] = useState([]); // メッセージを保存する状態
    const myId = parseInt(sessionStorage.getItem('MyID'), 10);

    const handleClick = async () => {
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

    const saveSubscription = async (subscription) => {
        console.log(myId);
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

    const sendPushNotification = async () => {
        const userId = myId; // 実際のユーザーIDを使用してください
        const message = "これはテストメッセージです"; // 送信するメッセージ内容

        try {
            const response = await fetch('https://loopplus.mydns.jp/api/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, message }),
            });

            const data = await response.json();
            if (data.success) {
                alert('プッシュ通知が送信されました！');
                showNotification(message); // 通知を表示
                addMessageToDisplay(message); // メッセージを表示
            } else {
                alert('通知の送信に失敗しました。');
            }
        } catch (error) {
            console.error('エラー:', error);
            alert('エラーが発生しました。');
        }
    };

    const addMessageToDisplay = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const showNotification = (message) => {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification('新しいメッセージ', {
                    body: message,
                    icon: '/icon.png', // アイコンのパス
                });
            }
        });
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
            </div>
        </>
    );
};

export default Push;

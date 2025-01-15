self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body,
        icon: '/icon.svg', // アイコンのパス
        badge: '/badge.svg', // バッジのパス
        data: {
            url: data.url // ペイロードからURLを取得
        }
    };

    console.log(data);

    // プッシュ通知を表示
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );

    // クライアントにメッセージを送信
    // event.waitUntil(
    //     self.clients.matchAll().then(clients => {
    //         clients.forEach(client => {
    //             client.postMessage({
    //                 body: data.body,
    //             });
    //         });
    //     })
    // );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    console.log(event.notification);
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

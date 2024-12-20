self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body,
        icon: '/icon.svg', // アイコンのパス
        badge: '/badge.svg', // バッジのパス
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('push', function (event) {
    const data = event.data?.json() || {};

    event.waitUntil(
        self.registration.showNotification(data.title || 'Thông báo mới', {
            body: data.body || 'Bạn có một thông báo!',
            icon: '/logo.png',
            data: { url: data.url || '/' }
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

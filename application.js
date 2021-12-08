document.querySelector('#notification-button').onclick = async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('Mengijinkan App ini untuk memberi Info?');
    } else {
      const timestamp = new Date().getTime() + 5 * 1000; // now plus 5000ms
      reg.showNotification(
        'Yuk Cari Weton Kamu',
        {
          tag: timestamp, // a unique ID
          body: 'Selamat Datang Di Wetonmu App', // content of the push notification
          showTrigger: new TimestampTrigger(timestamp), // set the time for the push notification
          data: {
            url: window.location.href, // pass the current url to the notification
          },
          badge: './ICON/icon-192x192.png',
          icon: './ICON/icon-192x192.png',
        }
      );
    }
  });
};
reg.showNotification(
  'Yuk Cari Weton Kamu',
  {
    tag: timestamp, // a unique ID
    body: 'Selamat Datang Di Wetonmu App', // content of the push notification
    showTrigger: new TimestampTrigger(timestamp), // set the time for the push notification
    data: {
      url: window.location.href, // pass the current url to the notification
    },
          badge: './ICON/icon-192x192.png',
          icon: './ICON/icon-192x192.png',
    actions: [
      {
        action: 'open',
        title: 'Open app’
      },
      {
        action: 'close',
        title: 'Close notification',
      }
    ]
  }
);

document.querySelector('#notification-cancel').onclick = async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  const notifications = await reg.getNotifications({
    includeTriggered: true
  });
  notifications.forEach(notification => notification.close());
  alert(`${notifications.length} notification(s) cancelled`);
};

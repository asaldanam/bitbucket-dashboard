//public/sw.js
self.addEventListener("install", App);

function App() {
  // initPolling();

  self.addEventListener('notificationclick', function(event) {
    switch(event.action) {
      case 'open_url':
        clients.openWindow(event.notification.data.url); //which we got from above
      break;
      case 'any_other_action':
        clients.openWindow("https://www.example.com");
      break;
    }
  }, false);
}

// function initPolling() {
//   setInterval(notify, 5000)
// }

// function notify() {
//   self.registration.showNotification(new Date().toISOString());
// }
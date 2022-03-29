//public/sw.js
self.addEventListener("install", App);

function App() {
  // initPolling();
}

function initPolling() {
  setInterval(notify, 5000)
}

function notify() {
  self.registration.showNotification(new Date().toISOString());
}
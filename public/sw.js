//public/sw.js
self.addEventListener("install", App);

// (() => {
//   // polling
//   setInterval(notify, 5000)
// })

function notify() {
  self.registration.showNotification(new Date().toISOString());
}
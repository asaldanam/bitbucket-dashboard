import { useEffect } from "react";

export default function () {
  useEffect(() => {
    if (Notification.permission === 'granted') return;
    Notification.requestPermission();
  }, []);

  async function send(title: string, options?: NotificationOptions) {
    if (Notification.permission !== 'granted') return;

    const sw = await navigator.serviceWorker.getRegistration();
    sw?.showNotification(title, options);
  }

  return { send }
}
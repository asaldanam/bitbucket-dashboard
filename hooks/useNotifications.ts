import { useEffect } from "react";

export default function () {
  useEffect(() => {
    if (Notification.permission === 'granted') return;
    Notification.requestPermission();
  }, []);

  async function send(msg: string) {
    if (Notification.permission !== 'granted') return;

    const sw = await navigator.serviceWorker.getRegistration();
    sw?.showNotification(msg);
  }

  return { send }
}
import { useEffect } from "react";

export default function useServiceWorker() {
    useEffect(() => {

    Notification.requestPermission();

    window.addEventListener("load", async () => {
      const result = await navigator.serviceWorker.register("/sw.js")
      console.log(result);
    });

  }, []);
}
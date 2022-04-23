import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import useServiceWorker from '../hooks/useServiceWorker';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useServiceWorker();

  useEffect(() => setIsClient(true), []);

  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : (
        <Component {...pageProps} />
      )}
    </div>
  )
}

export default MyApp

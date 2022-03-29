import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import useServiceWorker from '../hooks/useServiceWorker';

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  useServiceWorker();

  useEffect(() => setIsClient(true), []);

  return isClient && <Component {...pageProps} />
}

export default MyApp

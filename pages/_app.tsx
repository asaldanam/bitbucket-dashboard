import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import useServiceWorker from '../shared/hooks/useServiceWorker';
import '@atlaskit/css-reset/dist/bundle.css';
import { PullRequestStore } from 'stores/PullRequestStore';

function MyApp({ Component, pageProps }: AppProps) {
  const [, setIsClient] = useState(false);

  useServiceWorker();

  useEffect(() => {
    setIsClient(true)
    console.log('RELEASE V2')
  }, []);


  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : (
        <PullRequestStore.Provider>
          <Component {...pageProps} />
        </PullRequestStore.Provider>
      )}
    </div>
  )
}

export default MyApp

import { CacheProvider, EmotionCache } from '@emotion/react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Atom, Provider } from 'jotai';
import { queryClientAtom } from 'jotai/query';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';
import createEmotionCache from '../utils/createEmotionCache';
import { NextPageWithLayout } from './page';
import ThemeProvider from './ThemeProvider';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface AppPropsWithLayout extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function MyApp(props: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const { emotionCache = clientSideEmotionCache, Component, pageProps } = props;
  const getLayout = Component.getLayout || ((page) => page);

  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider
            initialValues={
              [[queryClientAtom, queryClient]] as Iterable<
                readonly [Atom<unknown>, unknown]
              >
            }
          >
            <CacheProvider value={emotionCache}>
              <Head>
                <meta
                  name="viewport"
                  content="initial-scale=1, width=device-width"
                />
              </Head>
              <ThemeProvider>
                {getLayout(<Component {...pageProps} />)}
              </ThemeProvider>
            </CacheProvider>
          </Provider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;

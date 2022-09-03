import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { ColorContext } from '../state/color/ColorContext';
import '../styles/globals.css';
import createEmotionCache from '../utils/createEmotionCache';
import { darkTheme, lightTheme } from '../utils/theme';
import { NextPageWithLayout } from './page';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface AppPropsWithLayout extends AppProps {
  session?: Session | null | undefined;
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function MyApp(props: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const {
    session,
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = props;
  const getLayout = Component.getLayout || ((page) => page);

  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  let theme = mode === 'light' ? lightTheme : darkTheme;
  theme = responsiveFontSizes(theme); // apply mui responsive font sizes

  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ColorContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </ColorContext.Provider>
      </CacheProvider>
    </SessionProvider>
  );
}

export default MyApp;

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/globals.css';
import { NextPageWithLayout } from './page';
import { ColorContext } from '../state/color/ColorContext'

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
}

const cache = createCache({
  key: 'css',
  prepend: true,
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
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

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <CacheProvider value={cache}>
      <ColorContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </ColorContext.Provider>
    </CacheProvider>
  );
}

export default MyApp;

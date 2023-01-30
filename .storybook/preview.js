import { CacheProvider } from '@emotion/react';
import addons from '@storybook/addons';
import { SessionProvider } from 'next-auth/react';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // next 12
import * as NextImage from 'next/image';
import React from 'react';
import {
  DARK_MODE_EVENT_NAME,
  UPDATE_DARK_MODE_EVENT_NAME,
} from 'storybook-dark-mode';
import { ColorContext } from '../state/color/ColorContext';
import '../styles/globals.css';
import createEmotionCache from '../utils/createEmotionCache';
import { darkTheme, lightTheme } from '../utils/theme';

import { CssBaseline, ThemeProvider } from '@mui/material';

const BREAKPOINTS_INT = {
  xs: 375,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

const customViewports = Object.fromEntries(
  Object.entries(BREAKPOINTS_INT).map(([key, val], idx) => {
    console.log(val);
    return [
      key,
      {
        name: key,
        styles: {
          width: `${val}px`,
          height: `${(idx + 5) * 10}vh`,
        },
      },
    ];
  })
);

// Allow Storybook to handle Next's <Image> component
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

// get channel to listen to event emitter
const channel = addons.getChannel();

// create a component that uses the dark mode hook
function ThemeWrapper(props) {
  // this example uses hook but you can also use class component as well
  const [isDark, setDark] = React.useState(false);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        channel.emit(UPDATE_DARK_MODE_EVENT_NAME);
      },
    }),
    []
  );

  React.useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark);
    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
  }, [channel, setDark]);

  const clientSideEmotionCache = createEmotionCache();
  const session = undefined;

  // render your custom theme provider
  return (
    <SessionProvider session={session}>
      <CacheProvider value={clientSideEmotionCache}>
        <ColorContext.Provider value={colorMode}>
          <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <CssBaseline />
            {props.children}
          </ThemeProvider>
        </ColorContext.Provider>
      </CacheProvider>
    </SessionProvider>
  );
}

export const decorators = [
  (renderStory) => <ThemeWrapper>{renderStory()}</ThemeWrapper>,
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: { viewports: customViewports },
  darkMode: {
    current: 'light',
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

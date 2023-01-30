import '@fontsource/inter';
import '@fontsource/inter/300.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';

import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

// Create a light theme instance.
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#222222',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FCFCFC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1rem',
          color: '#FCFCFC',
          backgroundColor: '#222222',
        },
      },
    },
  },
});

// Create a dark theme instance.
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FCFCFC',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#222222',
      paper: '#18191A',
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1rem',
          color: '#222222',
          backgroundColor: '#FCFCFC',
        },
      },
    },
  },
});

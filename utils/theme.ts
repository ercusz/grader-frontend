import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// Create a light theme instance.
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#556cd6',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FFFFFF',
      paper: 'F5F5F5',
    },
  },
});

// Create a dark theme instance.
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#556cd6',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#22272E',
      paper: '#2D333B',
    },
  },
});

import { NoSsr } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { atomWithStorage } from 'jotai/utils';
import { ReactNode } from 'react';
import { useAtomTheme } from '@/states/atom-theme/useAtomTheme';
import { darkTheme, lightTheme } from '@/utils/theme';

interface Props {
  children: ReactNode;
}

export const darkModeAtom = atomWithStorage('darkMode', false);

function ThemeProvider({ children }: Props) {
  const [theme] = useAtomTheme();

  const muiTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <NoSsr>
      <MuiThemeProvider theme={responsiveFontSizes(muiTheme)}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NoSsr>
  );
}

export default ThemeProvider;

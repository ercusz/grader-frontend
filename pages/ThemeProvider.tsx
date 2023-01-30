import { useAtomTheme } from '@/hooks/atom-theme/useAtomTheme';
import { darkTheme, lightTheme } from '@/utils/theme';
import { CssBaseline, NoSsr, responsiveFontSizes } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { atomWithStorage } from 'jotai/utils';
import { ReactNode } from 'react';

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

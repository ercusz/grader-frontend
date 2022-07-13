import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { ColorContext } from '../../../state/color/ColorContext';

export interface IThemeToggleButton {}

const ThemeToggleButton: React.FC<IThemeToggleButton> = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorContext);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
        borderRadius: 1,
      }}
    >
      <IconButton
        className="w-full"
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Box>
  );
};

export default ThemeToggleButton;

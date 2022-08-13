import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { ColorContext } from '../../../state/color/ColorContext';

export interface IThemeToggleButton {}

const ThemeToggleButton: React.FC<IThemeToggleButton> = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorContext);

  return (
    <Tooltip
      className="mx-1"
      title={`แสดงผล ${theme.palette.mode === 'dark' ? 'Light' : 'Dark'} โหมด`}
    >
      <IconButton
        onClick={colorMode.toggleColorMode}
        aria-label="switch-mode"
        color="primary"
      >
        {theme.palette.mode === 'dark' ? <LightModeIcon /> : <BedtimeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;

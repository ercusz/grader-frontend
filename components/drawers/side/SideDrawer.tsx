import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, Divider, Drawer, IconButton, Toolbar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface ISideDrawer {
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
}

const SideDrawer: React.FC<ISideDrawer> = ({
  openDrawer,
  setOpenDrawer,
  children,
  anchor = 'left',
}) => {
  return (
    <Drawer
      anchor={anchor}
      sx={{
        width: { xs: '100%', md: '60%' },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', md: '60%' },
          boxSizing: 'border-box',
          bgcolor: (theme) => theme.palette.background.paper,
        },
      }}
      open={openDrawer}
      onClose={() => {
        setOpenDrawer(false);
      }}
    >
      <Toolbar
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          color: (theme) => theme.palette.text.primary,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.72),
          transition: 'all 0.2s ease-in-out',
          borderBottom: (theme) =>
            `1px double ${alpha(theme.palette.text.primary, 0.2)}`,
        }}
      >
        <IconButton
          aria-label="hide-problem"
          onClick={() => setOpenDrawer(false)}
        >
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>{children}</Box>
    </Drawer>
  );
};

export default SideDrawer;

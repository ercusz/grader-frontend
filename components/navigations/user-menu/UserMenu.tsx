import OutlinedAvatar from '@/components/avatars/outlined-avatar/OutlinedAvatar';
import { useAtomTheme } from '@/hooks/atom-theme/useAtomTheme';
import { useUser } from '@/hooks/user/useUser';
import { getUserFullName } from '@/utils/UserService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import Check from '@mui/icons-material/Check';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import * as React from 'react';

export interface IUserMenu {
  anchorElUser: null | HTMLElement;
  setAnchorElUser: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}

type Setting = {
  name: string;
  icon: React.ReactNode;
  link: string | undefined;
  action: any;
};

interface ISettings {
  settings: Setting[];
}

const Settings: React.FC<ISettings> = ({ settings }) => {
  const renderListItemText = (name: string, icon: React.ReactNode) => {
    let listItemTextElem = null;

    if (icon) {
      listItemTextElem = (
        <>
          <ListItemIcon>{icon}</ListItemIcon>
          {name}
        </>
      );
    } else {
      listItemTextElem = <ListItemText inset>{name}</ListItemText>;
    }

    return listItemTextElem;
  };

  interface IRenderMenuItem {
    key?: string | undefined;
    setting: Setting;
  }

  const renderMenuItem = ({ key, setting }: IRenderMenuItem) => {
    return (
      <MenuItem
        key={key}
        onClick={setting.action ? () => setting.action() : undefined}
      >
        {renderListItemText(setting.name, setting.icon)}
      </MenuItem>
    );
  };

  return (
    <>
      {settings.map((setting: Setting) => {
        if (setting.link) {
          return (
            <Link key={setting.name} href={setting.link}>
              {renderMenuItem({ key: undefined, setting: setting })}
            </Link>
          );
        }

        return renderMenuItem({ key: setting.name, setting: setting });
      })}
    </>
  );
};

const UserMenu: React.FC<IUserMenu> = ({ anchorElUser, setAnchorElUser }) => {
  const [showAppearance, setShowAppearance] = React.useState(false);
  const [theme, toggleTheme] = useAtomTheme();
  const { data: user } = useUser();

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleShowAppearance = () => {
    setShowAppearance(true);
  };

  const onSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: '/auth/sign-in',
    });
  };

  const settings = [
    {
      name: 'การตั้งค่า',
      icon: <SettingsIcon />,
      link: '/settings/profile',
      action: undefined,
    },
    {
      name: 'การแสดงผล',
      icon: <BedtimeIcon />,
      link: undefined,
      action: handleShowAppearance,
    },
    {
      name: 'ออกจากระบบ',
      icon: <LogoutIcon />,
      link: undefined,
      action: onSignOut,
    },
  ];

  return (
    <Menu
      elevation={12}
      sx={{
        mt: '45px',
      }}
      id="menu-appbar"
      anchorEl={anchorElUser}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
    >
      <MenuList
        dense
        sx={{
          minWidth: 240,
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.72),
        }}
      >
        <Box>
          <Stack
            className="w-full flex pt-1 pb-4"
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <OutlinedAvatar
              alt={user ? `${user?.username}'s profile image` : undefined}
              src={user?.profileImage ? user.profileImage.url : undefined}
              size="large"
            >
              {user && user.firstName && user.lastName
                ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
                : user?.username?.charAt(0)}
            </OutlinedAvatar>
            {user && user.firstName && user.lastName ? (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <Typography variant="inherit" noWrap>
                  {getUserFullName(user)}
                </Typography>
                <Chip
                  className="font-semibold scale-95"
                  size="small"
                  variant="outlined"
                  color={user.role.name === 'Student' ? 'success' : 'secondary'}
                  icon={
                    user.role.name === 'Student' ? (
                      <InsertEmoticonIcon />
                    ) : (
                      <EmojiObjectsIcon />
                    )
                  }
                  label={user.role.name.toUpperCase()}
                  sx={{ borderRadius: 2, pl: 0.4 }}
                />
              </Stack>
            ) : (
              <Link href="/settings/profile">
                <Chip
                  className="hover:animate-pulse"
                  clickable
                  size="small"
                  variant="outlined"
                  color="warning"
                  icon={<WarningIcon />}
                  label="คุณยังไม่ได้ทำการตั้งชื่อ"
                  sx={{ borderRadius: 2, pl: 0.4 }}
                />
              </Link>
            )}
            <Link href={`/p/@${user?.username}`}>
              <Typography className="text-sm cursor-pointer font-semibold hover:underline">
                @{user?.username}
              </Typography>
            </Link>
          </Stack>
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        {showAppearance ? (
          <div>
            <MenuItem onClick={() => setShowAppearance(false)}>
              <ListItemIcon>
                <ArrowBackIcon />
              </ListItemIcon>
              ย้อนกลับ
            </MenuItem>
            <MenuItem style={{ pointerEvents: 'none', whiteSpace: 'normal' }}>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                ธีม (แสดงผลเฉพาะในเบราว์เซอร์นี้เท่านั้น)
              </Typography>
            </MenuItem>
            <MenuItem onClick={toggleTheme} disabled={theme === 'light'}>
              {theme === 'light' && (
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
              )}
              <ListItemText inset={theme !== 'light'}>ธีมสว่าง</ListItemText>
            </MenuItem>
            <MenuItem onClick={toggleTheme} disabled={theme === 'dark'}>
              {theme === 'dark' && (
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
              )}
              <ListItemText inset={theme !== 'dark'}>ธีมมืด</ListItemText>
            </MenuItem>
          </div>
        ) : (
          <div>{settings && <Settings settings={settings} />}</div>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;

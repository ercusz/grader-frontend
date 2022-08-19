import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import Branding from '../branding/Branding';
import UserMenu from '../user-menu/UserMenu';

export interface IHeader extends React.ComponentPropsWithoutRef<'header'> {}

const pages = [
  {
    name: 'คลาสเรียนของฉัน',
    route: '/classroom',
  },
  {
    name: 'เพลย์กราวด์',
    route: '/playground',
  },
];

const Header: React.FC<IHeader> = () => {
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session == null) return;
  }, [session]);

  const router = useRouter();
  const [isInSignInPage, setIsInSignInPage] = React.useState(false);

  React.useEffect(() => {
    if (
      router.pathname === '/auth/sign-in' ||
      router.pathname === '/auth/sign-up'
    ) {
      setIsInSignInPage(true);
    }

    return () => setIsInSignInPage(false);
  }, [router.pathname]);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={
        isInSignInPage
          ? {}
          : {
              color: (theme) => theme.palette.text.primary,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 0.72),
              transition: 'all 0.2s ease-in-out',
            }
      }
      color={isInSignInPage ? 'transparent' : undefined}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Branding withText />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                visibility: session ? 'visible' : 'hidden',
                display: isInSignInPage ? 'none' : 'block',
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {session &&
                pages.map((page, index) => (
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <Link href={page.route}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </Link>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Branding large />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {session &&
              pages.map((page, index) => (
                <Link key={index} href={page.route}>
                  <Button
                    className="font-bold"
                    size="large"
                    onClick={handleCloseNavMenu}
                    sx={{ color: 'inherit', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {session ? (
              <>
                <Tooltip title="โปรไฟล์ของคุณ">
                  <IconButton
                    className="drop-shadow-2xl
                    bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                    onClick={handleOpenUserMenu}
                  >
                    <Avatar
                      className="transition-all
                      outline outline-offset-4 text-sm
                      bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
                      hover:outline-offset-2"
                      alt={
                        session.user
                          ? `${session.user?.username}'s profile image`
                          : undefined
                      }
                      src={
                        session.user?.profile
                          ? session.user.profile.url
                          : undefined
                      }
                      sx={{
                        width: 28,
                        height: 28,
                        outlineColor: (theme) =>
                          theme.palette.background.default,
                        color: 'white',
                      }}
                    >
                      {session.user.firstName && session.user.lastName
                        ? session.user.firstName?.charAt(0) +
                          session.user.lastName?.charAt(0)
                        : session.user.username?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <UserMenu
                  session={session}
                  anchorElUser={anchorElUser}
                  setAnchorElUser={setAnchorElUser}
                />
              </>
            ) : (
              <>
                {!isInSignInPage && (
                  <>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        flexGrow: 1,
                        display: { xs: 'none', md: 'flex' },
                      }}
                    >
                      <Link href="/auth/sign-in">
                        <Button className="font-bold" variant="text">
                          ลงชื่อเข้าใช้
                        </Button>
                      </Link>
                      <Link href="/auth/sign-up">
                        <Button variant="contained">เริ่มต้นใช้งาน</Button>
                      </Link>
                    </Stack>
                    <Link href="/auth/sign-in">
                      <IconButton
                        sx={{
                          flexGrow: 1,
                          display: { xs: 'flex', md: 'none' },
                        }}
                      >
                        <AccountCircleIcon />
                      </IconButton>
                    </Link>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

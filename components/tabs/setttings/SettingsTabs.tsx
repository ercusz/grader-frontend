import LockResetIcon from '@mui/icons-material/LockReset';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Tab, Tabs, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { atom, useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface ISettingsTabs {}

const tabsAtom = atom(0);

const tabs = [
  {
    name: 'โปรไฟล์',
    path: 'profile',
    icon: <ManageAccountsIcon />,
  },
  {
    name: 'เปลี่ยนรหัสผ่าน',
    path: 'change-password',
    icon: <LockResetIcon />,
  },
];

const SettingsTabs: React.FC<ISettingsTabs> = () => {
  const router = useRouter();
  const { pathname } = router;
  const theme = useTheme();
  const medium = useMediaQuery(theme.breakpoints.up('md'));

  const [, setValue] = useAtom(tabsAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getActiveTabIndex = Math.max(
    0,
    tabs.findIndex(({ path }) => {
      return path.length > 0 ? pathname.includes(path) : false;
    })
  );

  return (
    <Tabs
      orientation={medium ? 'vertical' : 'horizontal'}
      allowScrollButtonsMobile
      value={getActiveTabIndex}
      onChange={handleChange}
      sx={{
        '& .MuiTabs-indicator': {
          borderStyle: 'solid',
          borderRightWidth: '2px',
          borderColor: 'primary',
          borderRadius: 4,
        },
        '& .MuiTab-root': {
          position: 'relative',
          justifyContent: 'flex-start',
          minHeight: 40,
          mb: medium ? 2 : 0,
          '&:hover': {
            transform: 'scale(1.05)',
            opacity: 1,
          },
          transition: 'all 0.3s ease-in-out',
        },
      }}
    >
      {tabs.map((tab, idx) => (
        <Link
          key={tab.name}
          href={`/settings/${tab.path}`}
          passHref
          scroll={false}
        >
          <Tab
            disableRipple
            icon={tab.icon}
            iconPosition="start"
            label={tab.name}
            sx={{
              opacity: getActiveTabIndex === idx ? 1 : 0.5,
            }}
          />
        </Link>
      ))}
    </Tabs>
  );
};

export default SettingsTabs;

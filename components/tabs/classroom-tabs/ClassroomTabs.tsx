import { Tab, Tabs } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { atom, useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface IClassroomTabs {}

const tabsAtom = atom(0);

const tabs = [
  {
    name: 'ทั้งหมด',
    path: '',
  },
  {
    name: 'โพสต์',
    path: 'posts',
  },
  {
    name: 'งานที่ได้รับมอบหมาย',
    path: 'assignments',
  },
  {
    name: 'เอกสารประกอบการสอน',
    path: 'materials',
  },
];

const ClassroomTabs: React.FC<IClassroomTabs> = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { pathname } = router;

  const [, setValue] = useAtom(tabsAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getActiveTabIndex = Math.max(
    0,
    tabs.findIndex(({ path }) => {
      if (path === 'assignments' && pathname.includes('topics')) {
        return true;
      }

      return path.length > 0 ? pathname.includes(path) : false;
    })
  );

  return (
    <Tabs
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      value={getActiveTabIndex}
      onChange={handleChange}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
      sx={{
        '& .MuiTabs-indicator': {
          display: 'flex',
          top: 6,
          bottom: 6,
          right: 6,
          height: 'auto',
          background: 'transparent',
          '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 2,
            left: 0,
            right: 0,
            bottom: 2,
            borderRadius: 4,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.1),
          },
        },
        '& .MuiTabs-scrollButtons.Mui-disabled': {
          opacity: 0.3,
        },
      }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={`/classroom/${slug}/${tab.path}`}
          passHref
          scroll={false}
        >
          <Tab label={tab.name} disableRipple />
        </Link>
      ))}
    </Tabs>
  );
};

export default ClassroomTabs;

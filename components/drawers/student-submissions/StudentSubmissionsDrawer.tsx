import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import { selectedSubmissionsAtom } from '@/stores/assignment-submissions';
import { UserResponse, UserSubmission } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import { compareAsc, compareDesc, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

export interface ISubmissionListItem {
  active: boolean;
  checkbox: React.ReactNode;
  href: string;
  avatar: React.ReactNode;
  studentName: string;
  studentId: string | null;
  graded: boolean;
  disabled?: boolean;
}

const SubmissionListItem: React.FC<ISubmissionListItem> = ({
  active,
  checkbox,
  href,
  avatar,
  studentName,
  studentId,
  graded,
  disabled,
}) => {
  return (
    <ListItemButton
      selected={active}
      sx={{
        p: 0,
      }}
      disabled={disabled}
    >
      <ListItemIcon
        sx={{
          px: 0,
          justifyContent: 'center',
        }}
      >
        {checkbox}
      </ListItemIcon>

      <Link href={href} passHref>
        <ListItemButton
          component="a"
          disableRipple
          sx={{
            px: 0,
            '&:hover': {
              bgcolor: 'transparent',
              '& .MuiTypography-root': {
                textDecoration: 'underline',
              },
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              display: 'flex',
              overflow: 'hidden',
              '& .MuiTypography-root': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          >
            {avatar}
            <Stack
              sx={{
                display: 'flex',
                overflow: 'hidden',
                pr: 2,
              }}
            >
              <Stack direction="row" alignItems="center">
                <Typography variant="body1" noWrap>
                  {studentName}
                </Typography>
                {graded && (
                  <Tooltip title="ได้รับการตรวจแล้ว">
                    <CheckCircleIcon
                      color="success"
                      fontSize="inherit"
                      sx={{ ml: 0.5 }}
                    />
                  </Tooltip>
                )}
              </Stack>
              <Typography variant="caption" noWrap>
                {studentId}
              </Typography>
            </Stack>
          </Stack>
        </ListItemButton>
      </Link>
    </ListItemButton>
  );
};

export interface IStudentSubmissionsDrawer {}

enum SORT_BY {
  createdAt = 'วันที่ส่งงาน',
  name = 'ชื่อผู้ส่ง',
  studentId = 'รหัสนักศึกษา',
  status = 'สถานะ',
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const CustomDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const StudentSubmissionsDrawer: React.FC<IStudentSubmissionsDrawer> = () => {
  const router = useRouter();
  const { slug, assignmentId, submissionId } = router.query;
  const { data: classroom } = useClassroomSlug({ slug: slug as string });
  const { data: { submissions } = {} } = useAssignmentSubmissions({
    classroomId: classroom?.id.toString() as string,
    assignmentId: assignmentId?.toString() as string,
  });

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useAtom(selectedSubmissionsAtom);

  const getStudentName = (student: UserResponse) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return student.username;
  };

  const [descSort, setDescSort] = useState(true);
  const [sortBy, setSortBy] = useState<
    'createdAt' | 'name' | 'studentId' | 'status'
  >('createdAt');

  const [anchorSortBy, setAnchorSortBy] = useState<null | HTMLElement>(null);
  const openSortByMenu = Boolean(anchorSortBy);

  const handleSortByButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorSortBy(e.currentTarget);
  };

  const handleChooseSortByButtonClick = (
    sortBy: 'createdAt' | 'name' | 'studentId' | 'status'
  ) => {
    setSortBy(sortBy);
    handleCloseSortByMenu();
  };

  const handleCloseSortByMenu = () => {
    setAnchorSortBy(null);
  };

  const sortingFunc = (a: UserSubmission, b: UserSubmission) => {
    if (sortBy === 'createdAt') {
      if (descSort) {
        return compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
      }

      return compareAsc(parseISO(a.createdAt), parseISO(b.createdAt));
    }
    if (sortBy === 'name') {
      const x = getStudentName(a.user);
      const y = getStudentName(b.user);

      return x.localeCompare(y) * (descSort ? -1 : 1);
    }
    if (sortBy === 'studentId') {
      const x = a.user.studentId || '';
      const y = b.user.studentId || '';

      return x.localeCompare(y) * (descSort ? -1 : 1);
    }
    if (sortBy === 'status') {
      const x = a.gradedBy ? a.gradedBy : '';
      const y = b.gradedBy ? b.gradedBy : '';

      return x.localeCompare(y) * (descSort ? -1 : 1);
    }

    return 0;
  };

  return (
    <>
      <CustomDrawer
        open={open}
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: (theme) => theme.palette.background.default,
          },
        }}
      >
        <Toolbar />
        <Toolbar />
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-end' : 'center',
            mr: open ? 1 : 0,
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <Box
          sx={{
            display: open ? 'block' : 'none',
          }}
        >
          <List>
            <ListItem>
              <Stack
                direction="column"
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  '& .MuiTypography-root': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  justifyContent: 'flex-end',
                  width: '100%',
                }}
              >
                <Typography
                  className="text-right"
                  variant="h6"
                  sx={{ fontWeight: 'bold' }}
                  noWrap
                >
                  นักเรียนที่ส่งงาน
                </Typography>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="text"
                    size="small"
                    disableRipple
                    onClick={handleSortByButtonClick}
                    disabled={submissions ? submissions.length === 0 : true}
                    sx={{
                      px: 0,
                      justifyContent: 'flex-end',
                      '&.MuiButtonBase-root:hover': {
                        bgcolor: 'transparent',
                      },
                    }}
                  >
                    <Typography className="font-bold" variant="caption" noWrap>
                      {SORT_BY[sortBy]}
                    </Typography>
                  </Button>
                  <Tooltip
                    title={descSort ? 'มาก -> น้อย' : 'น้อย -> มาก'}
                    arrow
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      disableRipple
                      onClick={() => setDescSort(!descSort)}
                      disabled={submissions ? submissions.length === 0 : true}
                      sx={{ pr: 0 }}
                    >
                      <SwitchLeftIcon
                        fontSize="inherit"
                        sx={{
                          rotate: descSort ? '90deg' : '270deg',
                          transition: 'all 0.3s fade-out',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </ListItem>

            <Divider />

            <SubmissionListItem
              active={submissionId === undefined}
              checkbox={
                <Checkbox
                  checked={submissions?.length === selected.length}
                  indeterminate={
                    submissions
                      ? selected.length > 0 &&
                        selected.length < submissions.length
                      : false
                  }
                  onChange={() => {
                    if (submissions?.length === selected.length) {
                      setSelected([]);
                    } else {
                      if (submissions) {
                        setSelected(
                          submissions.map((submission) => submission.id)
                        );
                      }
                    }
                  }}
                />
              }
              href={`/classroom/${slug}/assignments/${assignmentId}/submissions`}
              avatar={
                <Avatar sx={{ bgcolor: (theme) => theme.palette.success.main }}>
                  <PeopleAltIcon />
                </Avatar>
              }
              studentName="เลือกทั้งหมด"
              studentId={null}
              graded={false}
              disabled={submissions ? submissions.length === 0 : true}
            />

            <Divider />

            {submissions &&
              submissions.sort(sortingFunc).map((submission) => (
                <SubmissionListItem
                  key={submission.id}
                  active={Number(submissionId) === submission.id}
                  checkbox={
                    <Checkbox
                      checked={
                        selected.findIndex((id) => id === submission.id) !== -1
                      }
                      onChange={() => {
                        if (
                          selected.findIndex((id) => id === submission.id) !==
                          -1
                        ) {
                          setSelected(
                            selected.filter((id) => id !== submission.id)
                          );
                        } else {
                          setSelected([...selected, submission.id]);
                        }
                      }}
                    />
                  }
                  href={`/classroom/${slug}/assignments/${assignmentId}/submissions/${submission.id}`}
                  avatar={
                    <Avatar
                      alt={`${submission.user.username}'s profile image`}
                      src={getImagePath(submission.user.profileImage)}
                    >
                      {submission.user.firstName && submission.user.lastName
                        ? submission.user.firstName?.charAt(0) +
                          submission.user.lastName?.charAt(0)
                        : submission.user.username?.charAt(0)}
                    </Avatar>
                  }
                  studentName={getStudentName(submission.user)}
                  studentId={submission.user.studentId || null}
                  graded={Boolean(submission.gradedBy)}
                />
              ))}
          </List>
        </Box>
      </CustomDrawer>

      <Menu
        id="sort-by-menu"
        anchorEl={anchorSortBy}
        open={openSortByMenu}
        onClose={handleCloseSortByMenu}
        MenuListProps={{
          'aria-labelledby': 'sort-by-menu',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiListItemIcon-root': {
            ml: 2,
            display: 'flex',
            flexGrow: 0,
          },
          '& .MuiListItemText-root': {
            display: 'flex',
            flexGrow: 1,
          },
        }}
      >
        <MenuItem
          sx={{ pointerEvents: 'none', py: 0, pl: 0, ml: 2, minHeight: 0 }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            จัดเรียงตาม
          </Typography>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseSortByButtonClick('createdAt')}
        >
          <ListItemText>วันที่ส่งงาน</ListItemText>
          <ListItemIcon
            sx={{
              opacity: SORT_BY[sortBy] === SORT_BY.createdAt ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseSortByButtonClick('name')}
        >
          <ListItemText>ชื่อผู้ส่ง</ListItemText>
          <ListItemIcon
            sx={{
              opacity: SORT_BY[sortBy] === SORT_BY.name ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseSortByButtonClick('studentId')}
        >
          <ListItemText>รหัสนักศึกษา</ListItemText>
          <ListItemIcon
            sx={{
              opacity: SORT_BY[sortBy] === SORT_BY.studentId ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseSortByButtonClick('status')}
        >
          <ListItemText>สถานะ</ListItemText>
          <ListItemIcon
            sx={{
              opacity: SORT_BY[sortBy] === SORT_BY.status ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          sx={{
            pointerEvents: 'none',
            py: 0,
            pl: 0,
            ml: 2,
            minHeight: 0,
            justifyContent: 'flex-end',
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            จาก {descSort ? 'มาก -> น้อย' : 'น้อย -> มาก'}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default StudentSubmissionsDrawer;

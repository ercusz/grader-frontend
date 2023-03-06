import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import { selectedSubmissionsAtom } from '@/stores/assignment-submissions';
import { StudentSubmission, UserResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Collapse,
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
import { alpha, CSSObject, styled, Theme } from '@mui/material/styles';
import { compareAsc, compareDesc, isBefore, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useMemo, useState } from 'react';

const drawerWidth = 380;
type statusType = 'notSubmitted' | 'submitted' | 'graded' | 'resubmitted';
const statuses: statusType[] = [
  'submitted',
  'resubmitted',
  'notSubmitted',
  'graded',
];

export interface IStudentListItem {
  active: boolean;
  checkbox: React.ReactNode;
  href: string;
  avatar: React.ReactNode;
  studentName: string;
  studentId: string | null;
  status?: statusType;
  disabled?: boolean;
  point?: number;
  maxPoint?: number;
}

const StudentListItem: React.FC<IStudentListItem> = ({
  active,
  checkbox,
  href,
  avatar,
  studentName,
  studentId,
  status,
  disabled,
  point,
  maxPoint,
}) => {
  return (
    <ListItemButton
      selected={active}
      sx={{
        p: 0,
        width: drawerWidth,
        borderBottom: (theme) =>
          `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
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
              width: 200,
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
                '&:hover': {
                  '& .MuiTypography-root': {
                    textDecoration: 'underline',
                  },
                },
              }}
            >
              <Stack direction="row" alignItems="center">
                <Typography variant="body1" noWrap>
                  {studentName}
                </Typography>
              </Stack>
              <Typography variant="caption" noWrap>
                {studentId}
              </Typography>
            </Stack>
          </Stack>

          {status && (
            <Box
              sx={{
                display: 'flex',
                px: 2,
                minWidth: 100,
                borderLeft: (theme) =>
                  `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                '&:hover': {
                  '& .maxScore': {
                    opacity: '1 !important',
                  },
                },
              }}
            >
              <Stack direction="column">
                <Typography variant="body2" color="primary">
                  {point}
                  <span
                    className={`maxScore ${
                      active ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    /{maxPoint}
                  </span>
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: active ? 'bold' : 'normal',
                  }}
                >
                  {STATUS[status]}
                </Typography>
              </Stack>
            </Box>
          )}
        </ListItemButton>
      </Link>
    </ListItemButton>
  );
};

export interface IStudentSubmissionsDrawer {}

enum SORT_BY {
  createdAt = 'วันที่ส่งงาน',
  name = 'ชื่อผู้เรียน',
  studentId = 'รหัสนักศึกษา',
  status = 'สถานะ',
}

enum STATUS {
  notSubmitted = 'ยังไม่ส่งงาน',
  submitted = 'รอการตรวจ',
  graded = 'ตรวจแล้ว',
  resubmitted = 'มีการแก้ไข',
}

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

export interface IStatusGroupListItem {
  status: statusType;
  children: React.ReactNode;
  childrenSize?: number;
}

const StatusGroupListItem: React.FC<IStatusGroupListItem> = ({
  status,
  children,
  childrenSize,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={handleOpenClick}
        selected={open}
        sx={{
          borderBottom: (theme) =>
            `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
        }}
      >
        <ListItemIcon>({childrenSize ?? 0})</ListItemIcon>
        <ListItemText
          primary={STATUS[status]}
          sx={
            open
              ? {
                  '& .MuiTypography-root': {
                    fontWeight: 'bold',
                  },
                }
              : {}
          }
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

const StudentSubmissionsDrawer: React.FC<IStudentSubmissionsDrawer> = () => {
  const router = useRouter();
  const [parent] = useAutoAnimate();
  const { slug, assignmentId, studentId } = router.query;
  const { data: classroom } = useClassroomSlug({ slug: slug as string });
  const { data: { students } = {}, data: assignment } =
    useAssignmentSubmissions({
      classroomId: classroom?.id.toString() as string,
      assignmentId: assignmentId?.toString() as string,
    });

  const groups = useMemo(() => {
    return {
      notSubmitted: students?.filter((student) => !student.submission) ?? [],
      submitted:
        students?.filter(
          (student) => student.submission && !student.scoreInfo
        ) ?? [],
      graded:
        students?.filter(
          (student) =>
            student.submission &&
            student.scoreInfo &&
            !isBefore(
              parseISO(student.scoreInfo.gradedAt),
              parseISO(student.submission.createdAt)
            )
        ) ?? [],
      resubmitted:
        students?.filter(
          (student) =>
            student.submission &&
            student.scoreInfo &&
            isBefore(
              parseISO(student.scoreInfo.gradedAt),
              parseISO(student.submission.createdAt)
            )
        ) ?? [],
    };
  }, [students]);

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

  const sortingFunc = (a: StudentSubmission, b: StudentSubmission) => {
    if (sortBy === 'createdAt') {
      if (descSort) {
        if (!a.submission) {
          return 1;
        }
        if (!b.submission) {
          return -1;
        }

        return compareDesc(
          parseISO(a.submission.createdAt),
          parseISO(b.submission.createdAt)
        );
      }

      if (!a.submission) {
        return -1;
      }
      if (!b.submission) {
        return 1;
      }
      return compareAsc(
        parseISO(a.submission.createdAt),
        parseISO(b.submission.createdAt)
      );
    }
    if (sortBy === 'name') {
      const x = getStudentName(a);
      const y = getStudentName(b);

      return x.localeCompare(y) * (descSort ? -1 : 1);
    }
    if (sortBy === 'studentId') {
      const x = a.studentId || '';
      const y = b.studentId || '';

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
          <List ref={parent}>
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
                  ผู้เรียนทั้งหมด
                </Typography>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="text"
                    size="small"
                    disableRipple
                    onClick={handleSortByButtonClick}
                    disabled={students ? students.length === 0 : true}
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
                  <IconButton
                    size="small"
                    color="primary"
                    disableRipple
                    onClick={() => setDescSort(!descSort)}
                    disabled={students ? students.length === 0 : true}
                    sx={{
                      pr: 0,
                      visibility: sortBy === 'status' ? 'hidden' : 'visible',
                    }}
                  >
                    <Tooltip
                      title={descSort ? 'มาก -> น้อย' : 'น้อย -> มาก'}
                      arrow
                    >
                      <SwitchLeftIcon
                        fontSize="inherit"
                        sx={{
                          rotate: descSort ? '90deg' : '270deg',
                          transition: 'all 0.3s fade-out',
                        }}
                      />
                    </Tooltip>
                  </IconButton>
                </Stack>
              </Stack>
            </ListItem>

            <Divider />

            <StudentListItem
              active={studentId === undefined}
              checkbox={
                <Checkbox
                  checked={students?.length === selected.length}
                  indeterminate={
                    students
                      ? selected.length > 0 && selected.length < students.length
                      : false
                  }
                  onChange={() => {
                    if (students?.length === selected.length) {
                      setSelected([]);
                    } else {
                      if (students) {
                        setSelected(
                          students.map((submission) => submission.id)
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
              disabled={students ? students.length === 0 : true}
            />

            {/* if not sort by status */}
            {sortBy !== 'status' &&
              assignment &&
              students &&
              students.sort(sortingFunc).map((student) => (
                <StudentListItem
                  key={student.id}
                  active={Number(studentId) === student.id}
                  checkbox={
                    <Checkbox
                      checked={
                        selected.findIndex((id) => id === student.id) !== -1
                      }
                      onChange={() => {
                        if (
                          selected.findIndex((id) => id === student.id) !== -1
                        ) {
                          setSelected(
                            selected.filter((id) => id !== student.id)
                          );
                        } else {
                          setSelected([...selected, student.id]);
                        }
                      }}
                    />
                  }
                  href={`/classroom/${slug}/assignments/${assignmentId}/submissions/student/${student.id}`}
                  avatar={
                    <Avatar
                      alt={`${student.username}'s profile image`}
                      src={getImagePath(student.profileImage)}
                    >
                      {student.firstName && student.lastName
                        ? student.firstName?.charAt(0) +
                          student.lastName?.charAt(0)
                        : student.username?.charAt(0)}
                    </Avatar>
                  }
                  studentName={getStudentName(student)}
                  studentId={student.studentId || null}
                  status={
                    (Object.keys(groups).find(
                      (key) =>
                        (groups as any)[key].findIndex(
                          (group: StudentSubmission) => group.id === student.id
                        ) !== -1
                    ) as statusType) || 'notSubmitted'
                  }
                  point={student.scoreInfo?.score ?? 0}
                  maxPoint={assignment.point}
                />
              ))}

            {/* if sort by status */}
            {sortBy === 'status' &&
              assignment &&
              groups &&
              statuses.map((status) => (
                <StatusGroupListItem
                  key={status}
                  status={status}
                  childrenSize={groups[status].length}
                >
                  {groups[status].map((student) => (
                    <StudentListItem
                      key={student.id}
                      active={Number(studentId) === student.id}
                      checkbox={
                        <Checkbox
                          checked={
                            selected.findIndex((id) => id === student.id) !== -1
                          }
                          onChange={() => {
                            if (
                              selected.findIndex((id) => id === student.id) !==
                              -1
                            ) {
                              setSelected(
                                selected.filter((id) => id !== student.id)
                              );
                            } else {
                              setSelected([...selected, student.id]);
                            }
                          }}
                        />
                      }
                      href={`/classroom/${slug}/assignments/${assignmentId}/submissions/student/${student.id}`}
                      avatar={
                        <Avatar
                          alt={`${student.username}'s profile image`}
                          src={getImagePath(student.profileImage)}
                        >
                          {student.firstName && student.lastName
                            ? student.firstName?.charAt(0) +
                              student.lastName?.charAt(0)
                            : student.username?.charAt(0)}
                        </Avatar>
                      }
                      studentName={getStudentName(student)}
                      studentId={student.studentId || null}
                      status={
                        (Object.keys(groups).find(
                          (key) =>
                            (groups as any)[key].findIndex(
                              (group: StudentSubmission) =>
                                group.id === student.id
                            ) !== -1
                        ) as statusType) || 'notSubmitted'
                      }
                      point={student.scoreInfo?.score ?? 0}
                      maxPoint={assignment.point}
                    />
                  ))}
                </StatusGroupListItem>
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
          <ListItemText>ชื่อผู้เรียน</ListItemText>
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
              visibility: sortBy === 'status' ? 'hidden' : 'visible',
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

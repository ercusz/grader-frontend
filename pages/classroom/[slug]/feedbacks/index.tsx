import AssignmentOverviewCard from '@/components/cards/assignment-overview/AssignmentOverviewCard';
import FeedbackLayout from '@/components/layouts/feedback/FeedbackLayout';
import { useAssignmentsOverview } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { AssignmentOverview } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getAssignmentsOverview } from '@/utils/AssignmentService';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import CheckIcon from '@mui/icons-material/Check';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import { compareAsc, compareDesc, parseISO } from 'date-fns';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { MouseEvent, useState } from 'react';
import { NextPageWithLayout } from '../../../page';

enum SORT_BY {
  dueDate = 'วันที่กำหนดส่งงาน',
  name = 'ชื่องาน',
  topic = 'หัวข้อ',
}

enum FILTER {
  all = 'ทั้งหมด',
  javaSrc = 'ซอร์สโค้ด',
  docs = 'เอกสาร',
}

const Feedbacks: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });
  const {
    isLoading: isLoadingAssignments,
    isSuccess: isSuccessAssignments,
    data: assignments,
  } = useAssignmentsOverview({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const [descSort, setDescSort] = useState(true);
  const [sortBy, setSortBy] = useState<'dueDate' | 'name' | 'topic'>('dueDate');
  const [filter, setFilter] = useState<'all' | 'javaSrc' | 'docs'>('all');

  const [anchorSortBy, setAnchorSortBy] = useState<null | HTMLElement>(null);
  const [anchorFilter, setAnchorFilter] = useState<null | HTMLElement>(null);
  const openSortByMenu = Boolean(anchorSortBy);
  const openFilterMenu = Boolean(anchorFilter);
  const [parent] = useAutoAnimate();

  const handleSortByButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorSortBy(e.currentTarget);
  };

  const handleFilterButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorFilter(e.currentTarget);
  };

  const handleChooseSortByButtonClick = (
    sortBy: 'dueDate' | 'name' | 'topic'
  ) => {
    setSortBy(sortBy);
    handleCloseSortByMenu();
  };

  const handleChooseFilterButtonClick = (
    filter: 'all' | 'javaSrc' | 'docs'
  ) => {
    setFilter(filter);
    handleCloseFilterMenu();
  };

  const handleCloseSortByMenu = () => {
    setAnchorSortBy(null);
  };

  const handleCloseFilterMenu = () => {
    setAnchorFilter(null);
  };

  const filterFunc = (assignment: AssignmentOverview) => {
    if (filter === 'all') {
      return true;
    }
    if (filter === 'javaSrc') {
      return assignment.type === 'java-src';
    }
    if (filter === 'docs') {
      return assignment.type === 'docs';
    }

    return false;
  };

  const sortingFunc = (a: AssignmentOverview, b: AssignmentOverview) => {
    if (sortBy === 'dueDate') {
      if (descSort) {
        return compareDesc(parseISO(a.endDate), parseISO(b.endDate));
      }

      return compareAsc(parseISO(a.endDate), parseISO(b.endDate));
    }
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title) * (descSort ? -1 : 1);
    }
    if (sortBy === 'topic') {
      const x = a.topic ? a.topic.name : '';
      const y = b.topic ? b.topic.name : '';

      return x.localeCompare(y) * (descSort ? -1 : 1);
    }

    return 0;
  };

  return (
    <section>
      <Head>
        <title>
          {classroom
            ? `${classroom.course.name} - ${classroom.name}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      {isLoadingClassroom && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {isSuccessClassroom && classroom && (
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} sm={12} md={12}>
            <Typography
              className="text-center"
              variant="h4"
              component="h1"
              gutterBottom
            >
              ติดตามความคืบหน้าของงาน
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Stack direction="row">
                  <Button
                    variant="text"
                    size="small"
                    disableRipple
                    onClick={handleSortByButtonClick}
                    disabled={assignments ? assignments.length === 0 : true}
                    sx={{
                      '&.MuiButtonBase-root:hover': {
                        bgcolor: 'transparent',
                      },
                    }}
                  >
                    <Typography variant="body2">
                      จัดเรียงตาม <strong>{SORT_BY[sortBy]}</strong>
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
                      disabled={assignments ? assignments.length === 0 : true}
                    >
                      <SwitchLeftIcon
                        sx={{
                          rotate: descSort ? '90deg' : '270deg',
                          transition: 'all 0.3s fade-out',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <Box>
                <Button
                  startIcon={<FilterListIcon />}
                  variant="text"
                  size="small"
                  disableRipple
                  onClick={handleFilterButtonClick}
                  disabled={assignments ? assignments.length === 0 : true}
                  sx={{
                    '&.MuiButtonBase-root:hover': {
                      bgcolor: 'transparent',
                    },
                  }}
                >
                  <Typography variant="body2">{FILTER[filter]}</Typography>
                </Button>
              </Box>
            </Stack>
            <Box
              ref={parent}
              sx={{
                maxHeight: '60vh',
                overflow: 'auto',
                mt: 1,
                p: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              {isLoadingAssignments && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <CircularProgress color="primary" />
                </Box>
              )}
              {isSuccessAssignments &&
                assignments.length > 0 &&
                assignments
                  .filter(filterFunc)
                  .sort(sortingFunc)
                  .map((assignment) => (
                    <AssignmentOverviewCard
                      key={assignment.id}
                      assignment={assignment}
                      classroomSlug={slug}
                    />
                  ))}
              {isSuccessAssignments && assignments.length < 1 && (
                <Typography variant="h5" align="center">
                  ไม่พบงาน
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

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
          onClick={() => handleChooseSortByButtonClick('dueDate')}
        >
          <ListItemText>วันที่กำหนดส่งงาน</ListItemText>
          <ListItemIcon
            sx={{
              opacity: SORT_BY[sortBy] === SORT_BY.dueDate ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseSortByButtonClick('name')}
        >
          <ListItemText>ชื่องาน</ListItemText>
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
          onClick={() => handleChooseSortByButtonClick('topic')}
        >
          <ListItemText>หัวข้อ</ListItemText>
          <ListItemIcon
            sx={{
              opacity: SORT_BY[sortBy] === SORT_BY.topic ? 1 : 0,
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

      <Menu
        id="filter-menu"
        anchorEl={anchorFilter}
        open={openFilterMenu}
        onClose={handleCloseFilterMenu}
        MenuListProps={{
          'aria-labelledby': 'filter-menu',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
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
            ตัวกรอง
          </Typography>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseFilterButtonClick('all')}
        >
          <ListItemText>ทั้งหมด</ListItemText>
          <ListItemIcon
            sx={{
              opacity: FILTER[filter] === FILTER.all ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseFilterButtonClick('javaSrc')}
        >
          <ListItemText>ซอร์สโค้ด</ListItemText>
          <ListItemIcon
            sx={{
              opacity: FILTER[filter] === FILTER.javaSrc ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          disableRipple
          onClick={() => handleChooseFilterButtonClick('docs')}
        >
          <ListItemText>เอกสาร</ListItemText>
          <ListItemIcon
            sx={{
              opacity: FILTER[filter] === FILTER.docs ? 1 : 0,
            }}
          >
            <CheckIcon color="success" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </section>
  );
};

export default Feedbacks;

Feedbacks.getLayout = (page) => {
  const { props } = page;
  const { slug, feedbackHeaderProps, contentProps } = props;
  return (
    <FeedbackLayout
      classroomSlug={slug}
      feedbackHeaderProps={feedbackHeaderProps}
      contentProps={contentProps}
    >
      {page}
    </FeedbackLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug }: any = context.params;
  const { req } = context;
  const token = await getToken({ req });

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();

  try {
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    const assignments = await queryClient.fetchQuery(
      ['assignmentsOverview', { classroomId: classroom.id }],
      () => getAssignmentsOverview(classroom.id)
    );

    if (!assignments) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: slug,
      feedbackHeaderProps: {
        backButton: false,
        downloadCurrentAssignmentButton: false,
      },
      contentProps: {
        subHeader: false,
        sidebar: false,
      },
      dehydratedState: dehydrate(queryClient),
    },
  };
};

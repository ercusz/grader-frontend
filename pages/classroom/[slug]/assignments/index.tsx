import AssignmentCard from '@/components/cards/assignment-card/AssignmentCard';
import AssignmentCardSkeleton from '@/components/cards/assignment-skeleton/AssignmentCardSkeleton';
import AssignmentTopicCard from '@/components/cards/assignment-topic/AssignmentTopicCard';
import CreateAssignmentDialog from '@/components/dialogs/create-assignment/CreateAssignmentDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import { Roles } from '@/constants/roles';
import { useAssignments } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { openCreateAssignmentDialogAtom } from '@/stores/create-assignment';
import { Assignment, Topic, User, UserResponse } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getUserRole } from '@/utils/role';
import AddIcon from '@mui/icons-material/Add';
import {
  Backdrop,
  Button,
  CircularProgress,
  Fab,
  Grid,
  Link as MuiLink,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { isBefore, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { NextPageWithLayout } from '../../../page';

const ClassroomAssignments: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = useUser();
  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const {
    isLoading: isLoadingAssignments,
    isSuccess: isSuccessAssignments,
    data: { assignments, topics } = { assignments: [], topics: [] },
  } = useAssignments({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const [, setOpenCreateAssignmentDialog] = useAtom(
    openCreateAssignmentDialogAtom
  );

  const getRole = (targetUser: UserResponse | User) => {
    return getUserRole({
      teachers: classroom?.course.teachers || ([] as UserResponse[]),
      teacherAssistants: classroom?.teacherAssistants || ([] as UserResponse[]),
      students: classroom?.students || ([] as UserResponse[]),
      targetUser: targetUser,
    });
  };

  function isAssignment(obj: any): obj is Assignment {
    return obj.point !== undefined;
  }

  function isTopic(obj: any): obj is Topic {
    return obj.name !== undefined;
  }

  return (
    <section>
      <Head>
        <title>
          {classroom
            ? `${classroom.course.name} - ${classroom.name}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      <Fab
        color="primary"
        variant="extended"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setOpenCreateAssignmentDialog(true)}
      >
        <AddIcon sx={{ mr: 1 }} />
        งาน
      </Fab>
      <CreateAssignmentDialog
        classroomSlug={slug}
        courseSlug={classroom?.course.slug}
      />
      {isLoadingClassroom && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {isSuccessClassroom && classroom && (
        <Grid
          container
          spacing={2}
          direction={{ xs: 'row', md: 'row-reverse' }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            {((user && getRole(user) === Roles.TEACHER) ||
              (user && getRole(user) === Roles.TA)) && (
              <List>
                <ListItem
                  disableGutters
                  alignItems="center"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    p: 4,
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 20,
                    }}
                    onClick={() => setOpenCreateAssignmentDialog(true)}
                  >
                    มอบหมายงาน
                  </Button>
                </ListItem>
              </List>
            )}
            {/* <LessonFiltersList /> */}
          </Grid>
          <Grid item xs={12} md={8} minHeight="40vh">
            {isLoadingAssignments && (
              <List sx={{ width: '100%' }}>
                {[...Array(4)].map((_, index) => (
                  <ListItem disableGutters key={index}>
                    <AssignmentCardSkeleton />
                  </ListItem>
                ))}
              </List>
            )}
            {isSuccessAssignments && assignments && assignments.length > 0 && (
              <List sx={{ width: '100%' }}>
                {[...topics, ...assignments]
                  .sort((a, b) =>
                    isBefore(parseISO(a.createdAt), parseISO(b.createdAt))
                      ? 1
                      : -1
                  )
                  .map((obj) => {
                    if (isAssignment(obj)) {
                      return (
                        <ListItem key={obj.id} disableGutters>
                          <AssignmentCard
                            classroomSlug={slug}
                            assignment={obj}
                          />
                        </ListItem>
                      );
                    }
                    if (isTopic(obj)) {
                      return (
                        <ListItem disableGutters key={obj.id}>
                          <AssignmentTopicCard
                            classroomSlug={slug}
                            topic={obj}
                          />
                        </ListItem>
                      );
                    }
                  })}
              </List>
            )}
            {isSuccessAssignments && assignments && assignments.length < 1 && (
              <List sx={{ width: '100%' }}>
                <Typography className="text-center mt-10" variant="h5">
                  ยังไม่มีโพสต์ในรายวิชานี้
                </Typography>
                {((user && getRole(user) === Roles.TEACHER) ||
                  (user && getRole(user) === Roles.TA)) && (
                  <Typography className="text-center">
                    คุณต้องการ{' '}
                    <MuiLink
                      className="cursor-pointer"
                      onClick={() => setOpenCreateAssignmentDialog(true)}
                    >
                      มอบหมายงานใหม่
                    </MuiLink>{' '}
                    ไหม?
                  </Typography>
                )}
              </List>
            )}
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomAssignments;

ClassroomAssignments.getLayout = (page) => {
  const { props } = page;
  const { slug } = props;
  return <ClassroomLayout slug={slug}>{page}</ClassroomLayout>;
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
    await queryClient.fetchQuery(['classroom', { slug: slug }], () =>
      getClassroomBySlug(slug)
    );
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: slug,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

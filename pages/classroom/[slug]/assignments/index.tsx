import AssignmentCard from '@/components/cards/assignment-card/AssignmentCard';
import CreateAssignmentDialog from '@/components/dialogs/create-assignment/CreateAssignmentDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import { useAssignments } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { openCreateAssignmentDialogAtom } from '@/stores/create-assignment';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import AddIcon from '@mui/icons-material/Add';
import {
  Backdrop,
  Button,
  CircularProgress,
  Fab,
  Grid,
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
  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const {
    isLoading: isLoadingAssignments,
    isSuccess: isSuccessAssignments,
    data: assignments,
  } = useAssignments({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const [, setOpenCreateAssignmentDialog] = useAtom(
    openCreateAssignmentDialogAtom
  );

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
      {isLoadingClassroom && isLoadingAssignments && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {isSuccessClassroom && isSuccessAssignments && classroom && (
        <Grid
          container
          spacing={2}
          direction={{ xs: 'row', md: 'row-reverse' }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
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
            {/* <LessonFiltersList /> */}
          </Grid>
          <Grid item xs={12} md={8}>
            <List sx={{ width: '100%' }}>
              {assignments.length > 0 ? (
                assignments
                  .sort((a, b) =>
                    isBefore(parseISO(a.createdAt), parseISO(b.createdAt))
                      ? 1
                      : -1
                  )
                  .map((assignment) => (
                    <ListItem key={assignment.id} disableGutters>
                      <AssignmentCard assignment={assignment} />
                    </ListItem>
                  ))
              ) : (
                <Typography className="text-center" variant="h6">
                  ไม่พบงานที่ได้รับมอบหมาย
                </Typography>
              )}
            </List>
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

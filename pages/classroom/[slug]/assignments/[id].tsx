import AssignmentContentCard from '@/components/cards/assignment-content/AssignmentContentCard';
import SubmissionStatusCard from '@/components/cards/submission-status/SubmissionStatusCard';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import { useAssignment } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { setToken } from '@/utils/APIHelper';
import { getAssignmentById } from '@/utils/AssignmentService';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import OutboxIcon from '@mui/icons-material/Outbox';
import { Backdrop, CircularProgress, Fab, Grid } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../../page';

const ClassroomAssignment: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const router = useRouter();
  const id = router.query.id as string;

  const {
    isLoading: isLoadingAssignment,
    isSuccess: isSuccessAssignment,
    data: assignment,
  } = useAssignment({
    assignmentId: id,
    classroomId: classroom?.id.toString(),
  });

  return (
    <section>
      <Head>
        <title>
          {classroom
            ? `${classroom.course.name} - ${classroom.name}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      {isLoadingClassroom && isLoadingAssignment && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {assignment?.type === 'java-src' && (
        <Link href={`/playground?assignmentId=${id}`}>
          <Fab
            variant="extended"
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <OpenInBrowserIcon sx={{ mr: 1 }} />
            ไปยังเพลย์กราวด์
          </Fab>
        </Link>
      )}
      {assignment?.type === 'docs' && (
        <Fab
          variant="extended"
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <OutboxIcon sx={{ mr: 1 }} />
          ส่งงาน
        </Fab>
      )}
      {isSuccessClassroom && isSuccessAssignment && classroom && (
        <Grid
          container
          spacing={2}
          direction={{ xs: 'row', md: 'row-reverse' }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <SubmissionStatusCard />
          </Grid>
          <Grid item xs={12} md={8}>
            {assignment && <AssignmentContentCard assignment={assignment} />}
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomAssignment;

ClassroomAssignment.getLayout = (page) => {
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
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    await queryClient.fetchQuery(['assignment', { id: context.query.id }], () =>
      getAssignmentById(context.query.id as string, classroom.id)
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

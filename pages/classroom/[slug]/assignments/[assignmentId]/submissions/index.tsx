import FeedbackLayout from '@/components/layouts/feedback/FeedbackLayout';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useAssignmentSubmissions } from '@/hooks/submission/useSubmission';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getAssignmentSubmissions } from '@/utils/SubmissionService';
import { CircularProgress, Container, Grid, Typography } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../../../../page';

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

const AssignmentSubmissions: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { assignmentId } = router.query;
  const { data: classroom } = useClassroomSlug({ slug: slug });
  const {
    isLoading,
    isSuccess,
    data: { submissions } = {},
  } = useAssignmentSubmissions({
    classroomId: classroom?.id.toString() as string,
    assignmentId: assignmentId?.toString() as string,
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
      {isLoading && (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            margin: 'auto',
            padding: 'auto',
          }}
        >
          <CircularProgress color="inherit" />
        </Container>
      )}

      {isSuccess && submissions && submissions.length > 0 && (
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" align="center">
              งานที่ส่ง
            </Typography>
          </Grid>
        </Grid>
      )}

      {isSuccess && submissions && submissions.length === 0 && (
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6" align="center">
              ไม่พบงานที่ส่ง
            </Typography>
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default AssignmentSubmissions;

AssignmentSubmissions.getLayout = (page) => {
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
  const { slug, assignmentId }: any = context.params;
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

    const assignmentSubmissions = await queryClient.fetchQuery(
      ['submissions', { assignmentId: assignmentId }],
      () => getAssignmentSubmissions(assignmentId, classroom.id.toString())
    );

    if (!assignmentSubmissions) {
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
        backButton: true,
        downloadCurrentAssignmentButton: true,
      },
      contentProps: {
        subHeader: true,
        sidebar: true,
      },
      dehydratedState: dehydrate(queryClient),
    },
  };
};

import AddIcon from '@mui/icons-material/Add';
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CourseClassroomCard from '../../components/cards/course-classroom/CourseClassroomCard';
import CourseHeader from '../../components/header/course-header/CourseHeader';
import PrimaryLayout from '../../components/layouts/primary/PrimaryLayout';
import { useCourseSlug } from '../../state/courses/useCourses';
import { getCourseBySlug } from '../../utils/ClassroomService';
import { NextPageWithLayout } from '../page';

const Course: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    isLoading,
    isError,
    isSuccess,
    data: course,
  } = useCourseSlug({ slug: slug });

  const router = useRouter();

  useEffect(() => {
    if (isError) {
      router.push('/404');
    }
  }, [isError, router]);

  return (
    <section>
      <Head>
        <title>{course ? course.name : 'ไม่พบรายวิชา'}</title>
      </Head>
      <Container maxWidth="lg">
        {isLoading && (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        {isSuccess && course && (
          <>
            <CourseHeader course={course} />
            <Grid container spacing={2} pb={8}>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Typography
                    className="font-bold"
                    variant="h5"
                    color="inherit"
                  >
                    กลุ่มการเรียน
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    size="small"
                  >
                    เพิ่มกลุ่มการเรียน
                  </Button>
                </Stack>
              </Grid>
              {course.section.map((sec) => {
                const postfix =
                  course.semester && course.year
                    ? ` (${course.semester}/${course.year})`
                    : '';
                const courseName = `${course.name}${postfix}`;

                return (
                  <Grid key={sec.id} item xs={12} sm={6} md={4} mt={4}>
                    <CourseClassroomCard
                      courseName={courseName}
                      classroom={sec}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </Container>
    </section>
  );
};

export default Course;

Course.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user.role.name !== 'Teacher') {
    return {
      redirect: {
        destination: '/classroom',
        permanent: true,
      },
    };
  }

  const { slug }: any = context.params;

  const queryClient = new QueryClient();

  let isError = false;
  let course = null;

  try {
    course = await queryClient.fetchQuery(['course', { slug: slug }], () =>
      getCourseBySlug(slug)
    );
  } catch (error) {
    isError = true;
  }

  return {
    props: {
      slug: slug,
      isError: isError,
      course: course,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
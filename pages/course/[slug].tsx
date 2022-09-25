import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
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

  return (
    <section>
      <Head>
        <title>{course ? course.name : 'ไม่พบรายวิชา'}</title>
      </Head>
      <Container maxWidth="lg">
        {isLoading && <Typography>Loading...</Typography>}
        {isError && <Typography>Oops, something went wrong...</Typography>}
        {isSuccess && course && (
          <>
            <Paper
              sx={{
                position: 'relative',
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${course?.coverImageUrl})`,
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: 'rgba(0,0,0,.5)',
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
              />
              <Grid container>
                <Grid item md={6}>
                  <Box
                    sx={{
                      position: 'relative',
                      px: { xs: 3, md: 6 },
                      pb: 1,
                      pr: { md: 0 },
                    }}
                  >
                    <Typography
                      sx={{ pt: 14 }}
                      component="h1"
                      variant="h3"
                      color="inherit"
                      gutterBottom
                    >
                      {course.name}
                    </Typography>
                    <Typography variant="h5" color="inherit" paragraph>
                      {`${course.semester}/${course.year}`}
                    </Typography>
                    <Typography variant="subtitle1" color="inherit" paragraph>
                      {`ผู้สอน: ${course.instructor.first_name} ${course.instructor.last_name}`}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            <Grid container>
              <Grid item md={6}>
                <Typography className="font-bold" variant="h4" color="inherit">
                  กลุ่มการเรียน
                </Typography>
              </Grid>
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

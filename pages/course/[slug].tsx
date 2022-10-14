import CourseClassroomCard from '@/components/cards/course-classroom/CourseClassroomCard';
import AddClassroomDialog from '@/components/dialogs/add-classroom/AddClassroomDialog';
import CourseHeader from '@/components/headers/course-header/CourseHeader';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { useCourseSlug } from '@/states/courses/useCourses';
import { useUser } from '@/states/user/useUser';
import { openAddClassroomsDialogAtom } from '@/stores/add-classrooms';
import { setToken } from '@/utils/APIHelper';
import { getCourseBySlug } from '@/utils/ClassroomService';
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
import { useAtom } from 'jotai';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
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

  const { data: user } = useUser();

  useEffect(() => {
    if (user?.role.name === 'Student') {
      router.push('/classroom');
    }
  }, [user, router]);

  const [_, setOpenDialog] = useAtom(openAddClassroomsDialogAtom);

  return (
    <section>
      <Head>
        <title>{course ? course.name : 'ไม่พบรายวิชา'}</title>
      </Head>
      <AddClassroomDialog courseSlug={slug} />
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
            <CourseHeader courseSlug={slug} />
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
                    onClick={() => setOpenDialog(true)}
                  >
                    เพิ่มกลุ่มการเรียน
                  </Button>
                </Stack>
              </Grid>
              {course?.classrooms?.map((classroom) => {
                const postfix =
                  course.semester && course.year
                    ? ` (${course.semester}/${course.year})`
                    : '';
                const courseName = `${course.name}${postfix}`;

                return (
                  <Grid key={classroom.id} item xs={12} sm={6} md={4} mt={4}>
                    <CourseClassroomCard
                      courseName={courseName}
                      classroom={classroom}
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
  const { slug }: any = context.params;
  const { req } = context;
  const token = await getToken({ req });

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['course', { slug: slug }], () =>
    getCourseBySlug(slug)
  );

  return {
    props: {
      slug: slug,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

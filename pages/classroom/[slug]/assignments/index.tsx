import {
  Backdrop,
  CircularProgress,
  Grid,
  List,
  ListItem,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import AssignmentCard from '@/components/cards/assignment-card/AssignmentCard';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import LessonFiltersList from '@/components/lists/lessonfilters-list/LessonFiltersList';
import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { NextPageWithLayout } from '../../../page';

const ClassroomAssignments: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    isLoading,
    isSuccess,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const course = {
    id: 1,
    name: 'Data Structures',
    semester: 1,
    year: 2565,
    section: [
      {
        id: 1,
        name: 'Section 1',
      },
      {
        id: 2,
        name: 'Section 2',
      },
      {
        id: 3,
        name: 'Section พิเศษ',
      },
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    instructor: {
      id: 1234,
      username: 'johndoe69',
      email: 'johnny@kku.edu',
      studentId: null,
      firstName: 'John',
      lastName: 'Doe',
      role: {
        id: 999999,
        name: 'Teacher',
      },
      profileImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
      },
    },
    slug: 'YXNkZm9ya3Ys',
  };

  return (
    <section>
      <Head>
        <title>
          {course && classroom
            ? `${course.name} - ${classroom.section}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      {isLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {isSuccess && classroom && course && (
        <Grid
          container
          spacing={2}
          direction={{ xs: 'row', md: 'row-reverse' }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <LessonFiltersList />
          </Grid>
          <Grid item xs={12} md={8}>
            <List sx={{ width: '100%' }}>
              {[...Array(15)].map((_, idx) => (
                <ListItem key={idx} disableGutters>
                  <AssignmentCard idx={idx} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomAssignments;

ClassroomAssignments.getLayout = (page) => {
  return <ClassroomLayout>{page}</ClassroomLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug }: any = context.params;

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

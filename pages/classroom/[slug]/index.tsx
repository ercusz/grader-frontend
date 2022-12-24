import CreatePostCard from '@/components/cards/create-post/CreatePostCard';
import PostCard from '@/components/cards/post-card/PostCard';
import CreatePostDialog from '@/components/dialogs/create-post/CreatePostDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import PinList from '@/components/lists/pin-list/PinList';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';

import {
  Backdrop,
  CircularProgress,
  Grid,
  List,
  ListItem,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { NextPageWithLayout } from '../../page';

const Classroom: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    isLoading,
    isSuccess,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  return (
    <section>
      <Head>
        <title>
          {classroom
            ? `${classroom.course?.name} - ${classroom.name}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      <CreatePostDialog
        classroomSlug={slug}
        courseSlug={classroom?.course?.slug}
      />
      {isLoading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {isSuccess && classroom && (
        <Grid
          container
          spacing={2}
          direction={{ xs: 'row', md: 'row-reverse' }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <List>
              <ListItem disableGutters>
                <CreatePostCard />
              </ListItem>
            </List>
            <PinList />
          </Grid>
          <Grid item xs={12} md={8}>
            <List sx={{ width: '100%' }}>
              {[...Array(15)].map((_, idx) => (
                <ListItem key={idx} disableGutters>
                  <PostCard />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default Classroom;

Classroom.getLayout = (page) => {
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
  await queryClient.prefetchQuery(['classroom', { slug: slug }], () =>
    getClassroomBySlug(slug)
  );

  return {
    props: {
      slug: slug,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

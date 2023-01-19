import CreatePostCard from '@/components/cards/create-post/CreatePostCard';
import PostCard from '@/components/cards/post-card/PostCard';
import PostCardSkeleton from '@/components/cards/post-skeleton/PostCardSkeleton';
import CreatePostDialog from '@/components/dialogs/create-post/CreatePostDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import PinList from '@/components/lists/pin-list/PinList';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { usePosts } from '@/hooks/post/usePost';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import {
  Backdrop,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { isBefore, parseISO } from 'date-fns';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { NextPageWithLayout } from '../../../page';

const ClassroomPosts: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const {
    isLoading: isLoadingPosts,
    isSuccess: isSuccessPosts,
    data: posts,
  } = usePosts({
    classroomId: classroom?.id ? classroom.id.toString() : '',
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
      <CreatePostDialog
        classroomSlug={slug}
        courseSlug={classroom?.course?.slug}
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
            <List>
              <ListItem disableGutters>
                <CreatePostCard />
              </ListItem>
            </List>
            <PinList
              classroomSlug={slug}
              posts={posts ? posts?.filter((post) => post.isPinned) : []}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            {isLoadingPosts && (
              <List sx={{ width: '100%' }}>
                {[...Array(4)].map((_, index) => (
                  <ListItem disableGutters key={index}>
                    <PostCardSkeleton />
                  </ListItem>
                ))}
              </List>
            )}
            {isSuccessPosts && posts && posts.length > 0 && (
              <List sx={{ width: '100%' }}>
                {posts
                  .sort((a, b) =>
                    isBefore(parseISO(a.updatedAt), parseISO(b.updatedAt))
                      ? 1
                      : -1
                  )
                  .map((post) => (
                    <div id={post.id.toString()} key={post.id}>
                      <ListItem disableGutters>
                        <PostCard post={post} classroomSlug={slug} />
                      </ListItem>
                    </div>
                  ))}
              </List>
            )}
            {isSuccessPosts && posts.length < 1 && (
              <List sx={{ width: '100%' }}>
                <Typography className="text-center" variant="h6">
                  ไม่พบโพสต์
                </Typography>
              </List>
            )}
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomPosts;

ClassroomPosts.getLayout = (page) => {
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

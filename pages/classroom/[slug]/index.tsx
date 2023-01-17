import AssignmentCard from '@/components/cards/assignment-card/AssignmentCard';
import AssignmentCardSkeleton from '@/components/cards/assignment-skeleton/AssignmentCardSkeleton';
import CreatePostCard from '@/components/cards/create-post/CreatePostCard';
import PostCard from '@/components/cards/post-card/PostCard';
import PostCardSkeleton from '@/components/cards/post-skeleton/PostCardSkeleton';
import CreatePostDialog from '@/components/dialogs/create-post/CreatePostDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import PinList from '@/components/lists/pin-list/PinList';
import { useAssignments } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { usePosts } from '@/hooks/post/usePost';
import { Assignment, Post } from '@/types/types';
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
import { isBefore, parseISO } from 'date-fns';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { NextPageWithLayout } from '../../page';

const Classroom: NextPageWithLayout = ({
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

  const {
    isLoading: isLoadingAssignments,
    isSuccess: isSuccessAssignments,
    data: assignments,
  } = useAssignments({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  function isPost(obj: any): obj is Post {
    return obj.isPinned !== undefined;
  }

  function isAssignment(obj: any): obj is Assignment {
    return obj.point !== undefined;
  }

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
            <List sx={{ width: '100%' }}>
              {(isLoadingPosts || isLoadingAssignments) &&
                [...Array(2)].map((_, index) => (
                  <div key={index}>
                    <ListItem disableGutters>
                      <AssignmentCardSkeleton />
                    </ListItem>
                    <ListItem disableGutters>
                      <PostCardSkeleton />
                    </ListItem>
                  </div>
                ))}
              {isSuccessPosts &&
                posts &&
                isSuccessAssignments &&
                assignments &&
                [...posts, ...assignments]
                  .sort((a, b) =>
                    isBefore(parseISO(a.updatedAt), parseISO(b.updatedAt))
                      ? 1
                      : -1
                  )
                  .map((obj) => {
                    if (isPost(obj)) {
                      return (
                        <div id={obj.id.toString()} key={`post-${obj.id}`}>
                          <ListItem disableGutters>
                            <PostCard classroomSlug={slug} post={obj} />
                          </ListItem>
                        </div>
                      );
                    } else if (isAssignment(obj)) {
                      return (
                        <ListItem key={`assignment-${obj.id}`} disableGutters>
                          <AssignmentCard
                            classroomSlug={slug}
                            assignment={obj}
                          />
                        </ListItem>
                      );
                    }
                  })}
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

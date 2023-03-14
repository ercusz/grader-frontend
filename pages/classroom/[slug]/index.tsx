import AssignmentCard from '@/components/cards/assignment-card/AssignmentCard';
import AssignmentCardSkeleton from '@/components/cards/assignment-skeleton/AssignmentCardSkeleton';
import CreatePostCard from '@/components/cards/create-post/CreatePostCard';
import MaterialCard from '@/components/cards/material-card/MaterialCard';
import PostCard from '@/components/cards/post-card/PostCard';
import PostCardSkeleton from '@/components/cards/post-skeleton/PostCardSkeleton';
import TopicCard from '@/components/cards/topic/TopicCard';
import CreateAssignmentDialog from '@/components/dialogs/create-assignment/CreateAssignmentDialog';
import CreateMaterialDialog from '@/components/dialogs/create-material/CreateMaterialDialog';
import CreatePostDialog from '@/components/dialogs/create-post/CreatePostDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import PinList from '@/components/lists/pin-list/PinList';
import { Roles } from '@/constants/roles';
import { useAssignments } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useMaterials } from '@/hooks/material/useMaterial';
import { usePosts } from '@/hooks/post/usePost';
import { useUser } from '@/hooks/user/useUser';
import { openCreatePostDialogAtom } from '@/stores/create-post';
import {
  Assignment,
  Material,
  Post,
  Topic,
  User,
  UserResponse,
} from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getUserRole } from '@/utils/role';
import {
  Backdrop,
  CircularProgress,
  Grid,
  Link as MuiLink,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { isBefore, parseISO } from 'date-fns';
import { useAtom } from 'jotai';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useMemo } from 'react';
import { NextPageWithLayout } from '../../page';

const Classroom: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = useUser();
  const [, setOpenCreatePostDialog] = useAtom(openCreatePostDialogAtom);
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
    data: { assignments, topics: topicWithAssignment } = {
      assignments: [],
      topicWithAssignment: [],
    },
  } = useAssignments({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const {
    isLoading: isLoadingMaterials,
    isSuccess: isSuccessMaterials,
    data: { materials, topics: topicWithMaterial } = {
      materials: [],
      topicWithMaterial: [],
    },
  } = useMaterials({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const topics = useMemo(() => {
    const topics: Topic[] = topicWithAssignment || [];

    topicWithMaterial?.forEach((topic) => {
      const index = topics.findIndex((t) => t.id === topic.id);

      if (index === -1) {
        topics.push(topic);
      } else {
        topics[index] = {
          ...topics[index],
          materials: topic.materials,
        };
      }
    });

    return topics;
  }, [topicWithAssignment, topicWithMaterial]);

  const isEmptyFeed =
    isSuccessPosts &&
    isSuccessAssignments &&
    isSuccessMaterials &&
    posts.length < 1 &&
    assignments.length < 1 &&
    materials.length < 1 &&
    topics.length < 1;

  const isAllSucceed =
    isSuccessPosts &&
    posts &&
    isSuccessAssignments &&
    assignments &&
    isSuccessMaterials &&
    materials &&
    topics;

  function isPost(obj: any): obj is Post {
    return obj.isPinned !== undefined;
  }

  function isAssignment(obj: any): obj is Assignment {
    return obj.point !== undefined;
  }

  function isMaterial(obj: any): obj is Material {
    return obj.publishedDate !== undefined;
  }

  function isTopic(obj: any): obj is Topic {
    return obj.name !== undefined;
  }

  const getRole = (targetUser: UserResponse | User) => {
    return getUserRole({
      teachers: classroom?.course.teachers || ([] as UserResponse[]),
      teacherAssistants: classroom?.teacherAssistants || ([] as UserResponse[]),
      students: classroom?.students || ([] as UserResponse[]),
      targetUser: targetUser,
    });
  };

  const isTeacherTA = Boolean(
    user &&
      ((user && getRole(user) === Roles.TEACHER) ||
        (user && getRole(user) === Roles.TA))
  );

  return (
    <section>
      <CreatePostDialog
        classroomSlug={slug}
        courseSlug={classroom?.course?.slug}
      />
      <CreateAssignmentDialog
        classroomSlug={slug}
        courseSlug={classroom?.course.slug}
      />
      <CreateMaterialDialog
        classroomSlug={slug}
        courseSlug={classroom?.course.slug}
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
                {user && <CreatePostCard userRole={getRole(user)} />}
              </ListItem>
            </List>
            <PinList
              classroomSlug={slug}
              posts={posts ? posts?.filter((post) => post.isPinned) : []}
            />
          </Grid>
          <Grid item xs={12} md={8} minHeight="40vh">
            <List sx={{ width: '100%' }}>
              {(isLoadingPosts || isLoadingAssignments || isLoadingMaterials) &&
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
              {isAllSucceed &&
                [...posts, ...assignments, ...materials, ...topics]
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
                            isTeacherTA={isTeacherTA}
                          />
                        </ListItem>
                      );
                    } else if (isMaterial(obj)) {
                      return (
                        <ListItem key={`material-${obj.id}`} disableGutters>
                          <MaterialCard
                            classroomSlug={slug}
                            material={obj}
                            isTeacherTA={isTeacherTA}
                          />
                        </ListItem>
                      );
                    } else if (isTopic(obj)) {
                      return (
                        <ListItem key={`topic-${obj.id}`} disableGutters>
                          <TopicCard classroomSlug={slug} topic={obj} />
                        </ListItem>
                      );
                    }
                  })}
              {isEmptyFeed && (
                <List sx={{ width: '100%' }}>
                  <Typography className="text-center mt-10" variant="h5">
                    ยังไม่มีโพสต์ในรายวิชานี้
                  </Typography>
                  <Typography className="text-center">
                    คุณต้องการ{' '}
                    <MuiLink
                      className="cursor-pointer"
                      onClick={() => setOpenCreatePostDialog(true)}
                    >
                      เขียนอะไรสักหน่อย...
                    </MuiLink>{' '}
                    ไหม?
                  </Typography>
                </List>
              )}
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
  const { slug, title } = props;
  return (
    <ClassroomLayout slug={slug} title={title}>
      {page}
    </ClassroomLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug }: any = context.params;
  const { req } = context;
  const token = await getToken({ req });

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();
  let title = 'ไม่พบรายวิชา';

  try {
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    title = `${classroom.name} - ${classroom.course?.name}`;
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: slug,
      title: title,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

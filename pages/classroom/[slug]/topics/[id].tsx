import TopicContentCard from '@/components/cards/topic-content/TopicContentCard';
import DeleteTopicDialog, {
  openDeleteTopicDialogAtom,
} from '@/components/dialogs/delete-topic/DeleteTopicDialog';
import EditTopicDialog from '@/components/dialogs/edit-topic/EditTopicDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useTopic } from '@/hooks/topic/useTopic';
import { useUser } from '@/hooks/user/useUser';
import { openEditTopicDialogAtom } from '@/stores/edit-topic';
import { User, UserResponse } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getUserRole } from '@/utils/role';
import { getTopicById } from '@/utils/TopicServices';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Backdrop,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Link as MuiLink,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import { useAtom } from 'jotai';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../../page';

const ClassroomTopic: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = useUser();

  const [, setOpenEditTopicDialog] = useAtom(openEditTopicDialogAtom);
  const [, setOpenDeleteTopicDialog] = useAtom(openDeleteTopicDialogAtom);

  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const router = useRouter();
  const id = router.query.id as string;

  const {
    isLoading: isLoadingTopic,
    isSuccess: isSuccessTopic,
    data: topic,
  } = useTopic({
    topicId: id,
    classroomId: classroom?.id.toString(),
  });

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
      {isLoadingClassroom && isLoadingTopic && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {
        // Dialogs
        topic && (
          <>
            <EditTopicDialog classroomSlug={slug} />
            <DeleteTopicDialog classroomSlug={slug} topic={topic} />
          </>
        )
      }
      {isSuccessClassroom && isSuccessTopic && classroom && topic && (
        <Grid
          container
          spacing={2}
          direction={{ xs: 'row', md: 'row-reverse' }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={isTeacherTA ? 4 : false}>
            {((user && getRole(user) === Roles.TEACHER) ||
              (user && getRole(user) === Roles.TA)) && (
              <List>
                <ListItem
                  disableGutters
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Button
                      className="w-full"
                      color="primary"
                      variant="contained"
                      size="large"
                      startIcon={<SettingsIcon />}
                      onClick={() => setOpenEditTopicDialog(true)}
                    >
                      จัดการหัวข้อ
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setOpenDeleteTopicDialog(true)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </ListItem>
              </List>
            )}
          </Grid>
          <Grid item xs={12} md={isTeacherTA ? 8 : 12} sx={{ mb: 6 }}>
            <Card className="shadow-md" variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ pt: 0, '&:last-child': { pb: 0 } }}>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  maxItems={2}
                  separator={<NavigateNextIcon fontSize="small" />}
                  sx={{ my: 2 }}
                >
                  <Link href={`/classroom/${slug}`} passHref>
                    <MuiLink
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color="inherit"
                    >
                      <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                      {classroom?.name}
                    </MuiLink>
                  </Link>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="inherit"
                  >
                    หัวข้อ
                  </Typography>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="text.primary"
                  >
                    <LibraryBooksIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {topic?.name}
                  </Typography>
                </Breadcrumbs>
              </CardContent>
            </Card>
            <TopicContentCard
              classroomSlug={slug}
              topic={topic}
              isTeacherTA={isTeacherTA}
            />
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomTopic;

ClassroomTopic.getLayout = (page) => {
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
  let title = 'ไม่พบหัวข้อ';

  try {
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    const topic = await queryClient.fetchQuery(
      ['topic', { id: context.query.id }],
      () => getTopicById(context.query.id as string, classroom.id)
    );

    if (!topic.name) {
      return {
        notFound: true,
      };
    }

    const topicName =
      topic.name.length > 20
        ? (title = topic.name.slice(0, 20) + '...')
        : topic.name;

    title = `${topicName} | ${classroom.name} - ${classroom.course?.name}`;
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

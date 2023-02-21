import AssignmentContentCard from '@/components/cards/assignment-content/AssignmentContentCard';
import SubmissionStatusCard from '@/components/cards/submission-status/SubmissionStatusCard';
import EditAssignmentDialog from '@/components/dialogs/edit-assignment/EditAssignmentDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import { Roles } from '@/constants/roles';
import { useAssignment } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { openEditAssignmentDialogAtom } from '@/stores/edit-assignment';
import { User, UserResponse } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { deleteAssignment, getAssignmentById } from '@/utils/AssignmentService';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getUserRole } from '@/utils/role';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import OutboxIcon from '@mui/icons-material/Outbox';
import {
  Backdrop,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Fab,
  Grid,
  Link as MuiLink,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import { useAtom } from 'jotai';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../../../page';

const ClassroomAssignment: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = useUser();

  const [, setOpenEditAssignmentDialog] = useAtom(openEditAssignmentDialogAtom);

  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const router = useRouter();
  const id = router.query.assignmentId as string;

  const {
    isLoading: isLoadingAssignment,
    isSuccess: isSuccessAssignment,
    data: assignment,
  } = useAssignment({
    assignmentId: id,
    classroomId: classroom?.id.toString(),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(
    () => deleteAssignment(id, classroom?.id.toString() as string),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'assignments',
          { classroomId: classroom?.id },
        ]);
        queryClient.invalidateQueries(['assignment', { id: id }]);
        alert('ลบงานสำเร็จ');
        router.push(`/classroom/${slug}/assignments`);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบงาน');
      },
    }
  );

  const handleDeleteAssignment = () => {
    if (confirm('ต้องการลบงานนี้หรือไม่?')) {
      mutation.mutate();
    }
  };

  const getRole = (targetUser: UserResponse | User) => {
    return getUserRole({
      teachers: classroom?.course.teachers || ([] as UserResponse[]),
      teacherAssistants: classroom?.teacherAssistants || ([] as UserResponse[]),
      students: classroom?.students || ([] as UserResponse[]),
      targetUser: targetUser,
    });
  };

  return (
    <section>
      <Head>
        <title>
          {classroom
            ? `${classroom.course.name} - ${classroom.name}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      {isLoadingClassroom && isLoadingAssignment && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {user && getRole(user) === Roles.STUDENT && (
        <>
          {assignment?.type === 'java-src' && (
            <Link
              href={`/playground?assignmentId=${id}&classroomId=${classroom?.id}&classroomSlug=${slug}`}
              as={`/playground`}
            >
              <Fab
                variant="extended"
                color="primary"
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                }}
              >
                <OpenInBrowserIcon sx={{ mr: 1 }} />
                ไปยังเพลย์กราวด์
              </Fab>
            </Link>
          )}
          {assignment?.type === 'docs' && (
            <Fab
              variant="extended"
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
              }}
            >
              <OutboxIcon sx={{ mr: 1 }} />
              ส่งงาน
            </Fab>
          )}
        </>
      )}
      {isSuccessClassroom && isSuccessAssignment && classroom && (
        <Grid
          container
          spacing={2}
          direction={{ xs: 'row', md: 'row-reverse' }}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            {(user && getRole(user) === Roles.TEACHER) ||
            (user && getRole(user) === Roles.TA) ? (
              <List>
                {assignment && (
                  <EditAssignmentDialog
                    classroomSlug={slug}
                    assignment={assignment}
                  />
                )}

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
                      startIcon={<EditIcon />}
                      onClick={() => setOpenEditAssignmentDialog(true)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteAssignment()}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </ListItem>
              </List>
            ) : (
              <SubmissionStatusCard />
            )}
          </Grid>
          <Grid item xs={12} md={8} sx={{ mb: 6 }}>
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
                  <Link href={`/classroom/${slug}/assignments`} passHref>
                    <MuiLink
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color="inherit"
                    >
                      งานที่ได้รับมอบหมาย
                    </MuiLink>
                  </Link>
                  {assignment?.topic && (
                    <Link
                      href={`/classroom/${slug}/topics/${assignment.topic.id}`}
                      passHref
                    >
                      <MuiLink
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                      >
                        <LibraryBooksIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        {assignment.topic.name}
                      </MuiLink>
                    </Link>
                  )}
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="text.primary"
                  >
                    <AssignmentIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {assignment.title}
                  </Typography>
                </Breadcrumbs>
              </CardContent>
            </Card>
            {assignment && <AssignmentContentCard assignment={assignment} />}
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomAssignment;

ClassroomAssignment.getLayout = (page) => {
  const { props } = page;
  const { slug } = props;
  return <ClassroomLayout slug={slug}>{page}</ClassroomLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug }: any = context.params;
  const { req } = context;
  const token = await getToken({ req });
  const { assignmentId } = context.query;

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();

  try {
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    const assignment = await queryClient.fetchQuery(
      ['assignment', { id: assignmentId }],
      () => getAssignmentById(assignmentId as string, classroom.id)
    );

    if (!assignment.title) {
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
      dehydratedState: dehydrate(queryClient),
    },
  };
};

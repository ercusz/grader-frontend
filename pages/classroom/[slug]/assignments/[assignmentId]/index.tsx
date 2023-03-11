import AssignmentContentCard from '@/components/cards/assignment-content/AssignmentContentCard';
import SubmissionStatusCard from '@/components/cards/submission-status/SubmissionStatusCard';
import CreateSubmissionDialog, {
  openCreateSubmissionDialogAtom,
} from '@/components/dialogs/create-submission/CreateSubmissionDialog';
import EditAssignmentDialog from '@/components/dialogs/edit-assignment/EditAssignmentDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import AssignmentCommentsSection from '@/components/sections/assignment-comments/AssignmentCommentsSection';
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
import AssessmentIcon from '@mui/icons-material/Assessment';
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
  Card,
  CardContent,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
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
  const [, setOpenCreateSubmissionDialog] = useAtom(
    openCreateSubmissionDialogAtom
  );

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
            <>
              <CreateSubmissionDialog
                assignmentId={assignment.id.toString() as string}
                classroomId={classroom?.id.toString() as string}
              />

              <Fab
                variant="extended"
                color="primary"
                onClick={() => setOpenCreateSubmissionDialog(true)}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                }}
              >
                <OutboxIcon sx={{ mr: 1 }} />
                ส่งงาน
              </Fab>
            </>
          )}
        </>
      )}
      {isSuccessClassroom && isSuccessAssignment && classroom && assignment && (
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
              <>
                <EditAssignmentDialog
                  classroomSlug={slug}
                  assignment={assignment}
                />

                <Card
                  className="shadow-md w-full"
                  variant="outlined"
                  sx={{
                    p: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .MuiCardContent-root': {
                      p: 0,
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Link
                        passHref
                        href={`/classroom/${slug}/assignments/${assignment.id}/submissions`}
                      >
                        <MuiLink underline="none">
                          <Tooltip title="ดูภาพรวมการส่งงาน" arrow>
                            <IconButton color="info">
                              <AssessmentIcon />
                            </IconButton>
                          </Tooltip>
                        </MuiLink>
                      </Link>

                      <Tooltip title="แก้ไขงาน" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => setOpenEditAssignmentDialog(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="ลบงาน" arrow>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteAssignment()}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </>
            ) : (
              <SubmissionStatusCard
                classroomId={classroom.id.toString() as string}
                assignmentId={id}
              />
            )}
            <Card
              className="shadow-xl w-full"
              variant="outlined"
              sx={{ p: 2, mt: 2 }}
            >
              <AssignmentCommentsSection
                assignment={assignment}
                classroomSlug={classroom.slug}
                hostId={
                  user
                    ? getRole(user) === Roles.STUDENT
                      ? (user.id.toString() as string)
                      : undefined
                    : undefined
                }
              />
            </Card>
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
            <AssignmentContentCard assignment={assignment} />
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

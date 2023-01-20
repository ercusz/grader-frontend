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
import { getAssignmentById } from '@/utils/AssignmentService';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getUserRole } from '@/utils/role';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import OutboxIcon from '@mui/icons-material/Outbox';
import {
  Backdrop,
  Button,
  CircularProgress,
  Fab,
  Grid,
  List,
  ListItem,
  Stack,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import '@uiw/react-markdown-preview/markdown.css';
import { useAtom } from 'jotai';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../../page';

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
  const id = router.query.id as string;

  const {
    isLoading: isLoadingAssignment,
    isSuccess: isSuccessAssignment,
    data: assignment,
  } = useAssignment({
    assignmentId: id,
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
              href={`/playground?assignmentId=${id}&classroomId=${classroom?.id}`}
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
                      onClick={() => alert('Delete')}
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
          <Grid item xs={12} md={8}>
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

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();

  try {
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    await queryClient.fetchQuery(['assignment', { id: context.query.id }], () =>
      getAssignmentById(context.query.id as string, classroom.id)
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

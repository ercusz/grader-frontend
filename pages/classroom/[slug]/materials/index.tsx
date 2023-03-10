import AssignmentCardSkeleton from '@/components/cards/assignment-skeleton/AssignmentCardSkeleton';
import MaterialCard from '@/components/cards/material-card/MaterialCard';
import TopicCard from '@/components/cards/topic/TopicCard';
import CreateMaterialDialog from '@/components/dialogs/create-material/CreateMaterialDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useMaterials } from '@/hooks/material/useMaterial';
import { useUser } from '@/hooks/user/useUser';
import { openCreateMaterialDialogAtom } from '@/stores/create-material';
import { Material, Topic, User, UserResponse } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { getUserRole } from '@/utils/role';
import AddIcon from '@mui/icons-material/Add';
import {
  Backdrop,
  Button,
  CircularProgress,
  Fab,
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
import Head from 'next/head';
import { NextPageWithLayout } from '../../../page';

const ClassroomMaterials: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = useUser();
  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const {
    isLoading: isLoadingMaterials,
    isSuccess: isSuccessMaterials,
    data: { materials, topics } = { materials: [], topics: [] },
  } = useMaterials({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const [, setOpenCreateMaterialDialog] = useAtom(openCreateMaterialDialogAtom);

  const getRole = (targetUser: UserResponse | User) => {
    return getUserRole({
      teachers: classroom?.course.teachers || ([] as UserResponse[]),
      teacherAssistants: classroom?.teacherAssistants || ([] as UserResponse[]),
      students: classroom?.students || ([] as UserResponse[]),
      targetUser: targetUser,
    });
  };

  const haveAMaterial =
    isSuccessMaterials &&
    materials &&
    (materials.length > 0 || topics.length > 0);

  function isMaterial(obj: any): obj is Material {
    return obj.publishedDate !== undefined;
  }

  function isTopic(obj: any): obj is Topic {
    return obj.name !== undefined;
  }

  return (
    <section>
      <Head>
        <title>
          {classroom
            ? `${classroom.course.name} - ${classroom.name}`
            : 'ไม่พบรายวิชา'}
        </title>
      </Head>
      <Fab
        color="primary"
        variant="extended"
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setOpenCreateMaterialDialog(true)}
      >
        <AddIcon sx={{ mr: 1 }} />
        เอกสาร
      </Fab>
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
            {((user && getRole(user) === Roles.TEACHER) ||
              (user && getRole(user) === Roles.TA)) && (
              <List>
                <ListItem
                  disableGutters
                  alignItems="center"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    p: 4,
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 20,
                    }}
                    onClick={() => setOpenCreateMaterialDialog(true)}
                  >
                    เพิ่มเอกสารประกอบการสอน
                  </Button>
                </ListItem>
              </List>
            )}
          </Grid>
          <Grid item xs={12} md={8} minHeight="40vh">
            {isLoadingMaterials && (
              <List sx={{ width: '100%' }}>
                {[...Array(4)].map((_, index) => (
                  <ListItem disableGutters key={index}>
                    <AssignmentCardSkeleton />
                  </ListItem>
                ))}
              </List>
            )}
            {haveAMaterial && (
              <List sx={{ width: '100%' }}>
                {[...topics, ...materials]
                  .sort((a, b) =>
                    isBefore(parseISO(a.createdAt), parseISO(b.createdAt))
                      ? 1
                      : -1
                  )
                  .map((obj) => {
                    if (isMaterial(obj)) {
                      return (
                        <ListItem key={obj.id} disableGutters>
                          <MaterialCard classroomSlug={slug} material={obj} />
                        </ListItem>
                      );
                    }
                    if (isTopic(obj)) {
                      return (
                        <ListItem disableGutters key={obj.id}>
                          <TopicCard classroomSlug={slug} topic={obj} />
                        </ListItem>
                      );
                    }
                  })}
              </List>
            )}
            {!haveAMaterial && (
              <List sx={{ width: '100%' }}>
                <Typography className="text-center mt-10" variant="h5">
                  ยังไม่มีเอกสารประกอบการสอนในรายวิชานี้
                </Typography>
                {((user && getRole(user) === Roles.TEACHER) ||
                  (user && getRole(user) === Roles.TA)) && (
                  <Typography className="text-center">
                    คุณต้องการ{' '}
                    <MuiLink
                      className="cursor-pointer"
                      onClick={() => setOpenCreateMaterialDialog(true)}
                    >
                      เพิ่มเอกสารใหม่
                    </MuiLink>{' '}
                    ไหม?
                  </Typography>
                )}
              </List>
            )}
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomMaterials;

ClassroomMaterials.getLayout = (page) => {
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

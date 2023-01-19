import MaterialCard from '@/components/cards/material-card/MaterialCard';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import LessonFiltersList from '@/components/lists/lessonfilters-list/LessonFiltersList';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import AddIcon from '@mui/icons-material/Add';
import {
  Backdrop,
  Button,
  CircularProgress,
  Fab,
  Grid,
  List,
  ListItem,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import { NextPageWithLayout } from '../../../page';

const ClassroomMaterials: NextPageWithLayout = ({
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
      >
        <AddIcon sx={{ mr: 1 }} />
        เอกสาร
      </Fab>
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
                >
                  เพิ่มเอกสารประกอบการสอน
                </Button>
              </ListItem>
            </List>
            <LessonFiltersList />
          </Grid>
          <Grid item xs={12} md={8} minHeight="40vh">
            <List sx={{ width: '100%' }}>
              {[...Array(15)].map((_, idx) => (
                <ListItem key={idx} disableGutters>
                  <MaterialCard idx={idx} />
                </ListItem>
              ))}
            </List>
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

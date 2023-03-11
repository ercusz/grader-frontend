import MaterialContentCard from '@/components/cards/material-content/MaterialContentCard';
import EditMaterialDialog from '@/components/dialogs/edit-material/EditMaterialDialog';
import ClassroomLayout from '@/components/layouts/classroom/ClassroomLayout';
import MaterialCommentsSection from '@/components/sections/material-comments/MaterialCommentsSection';
import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useMaterial } from '@/hooks/material/useMaterial';
import { useUser } from '@/hooks/user/useUser';
import { openEditMaterialDialogAtom } from '@/stores/edit-material';
import { User, UserResponse } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getClassroomBySlug } from '@/utils/ClassroomService';
import { deleteMaterial, getMaterialById } from '@/utils/MaterialService';
import { getUserRole } from '@/utils/role';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Backdrop,
  Breadcrumbs,
  Card,
  CardContent,
  CircularProgress,
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../../../page';

const ClassroomMaterial: NextPageWithLayout = ({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = useUser();

  const [, setOpenEditMaterialDialog] = useAtom(openEditMaterialDialogAtom);

  const {
    isLoading: isLoadingClassroom,
    isSuccess: isSuccessClassroom,
    data: classroom,
  } = useClassroomSlug({ slug: slug });

  const router = useRouter();
  const id = router.query.materialId as string;

  const {
    isLoading: isLoadingMaterial,
    isSuccess: isSuccessMaterial,
    data: material,
  } = useMaterial({
    materialId: id,
    classroomId: classroom?.id.toString(),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation(
    () => deleteMaterial(id, classroom?.id.toString() as string),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'materials',
          { classroomId: classroom?.id },
        ]);
        queryClient.invalidateQueries(['material', { id: id }]);
        alert('ลบเอกสารสำเร็จ');
        router.push(`/classroom/${slug}/materials`);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบเอกสาร');
      },
    }
  );

  const handleDeleteMaterial = () => {
    if (confirm('ต้องการลบเอกสารนี้หรือไม่?')) {
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
      {isLoadingClassroom && isLoadingMaterial && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {isSuccessClassroom && isSuccessMaterial && classroom && material && (
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
              <>
                <EditMaterialDialog classroomSlug={slug} material={material} />

                <Card
                  className="shadow-md w-full"
                  variant="outlined"
                  sx={{
                    p: 1,
                    mb: 2,
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
                      <Tooltip title="แก้ไขเอกสาร" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => setOpenEditMaterialDialog(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="ลบเอกสาร" arrow>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteMaterial()}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </>
            )}
            <Card className="shadow-xl w-full" variant="outlined" sx={{ p: 2 }}>
              <MaterialCommentsSection
                material={material}
                classroomSlug={classroom.slug}
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
                  <Link href={`/classroom/${slug}/materials`} passHref>
                    <MuiLink
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      color="inherit"
                    >
                      เอกสารประกอบการสอน
                    </MuiLink>
                  </Link>
                  {material?.topic && (
                    <Link
                      href={`/classroom/${slug}/topics/${material.topic.id}`}
                      passHref
                    >
                      <MuiLink
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                      >
                        <LibraryBooksIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        {material.topic.name}
                      </MuiLink>
                    </Link>
                  )}
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center' }}
                    color="text.primary"
                  >
                    <BookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {material.title}
                  </Typography>
                </Breadcrumbs>
              </CardContent>
            </Card>
            <MaterialContentCard material={material} />
          </Grid>
        </Grid>
      )}
    </section>
  );
};

export default ClassroomMaterial;

ClassroomMaterial.getLayout = (page) => {
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
  const { materialId } = context.query;

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();
  let title = 'ไม่พบเอกสาร';

  try {
    const classroom = await queryClient.fetchQuery(
      ['classroom', { slug: slug }],
      () => getClassroomBySlug(slug)
    );

    const material = await queryClient.fetchQuery(
      ['material', { id: materialId }],
      () => getMaterialById(materialId as string, classroom.id)
    );

    if (!material.title) {
      return {
        notFound: true,
      };
    }

    const materialName =
      material.title.length > 20
        ? (title = material.title.slice(0, 20) + '...')
        : material.title;

    title = `${materialName} | ${classroom.name} - ${classroom.course?.name}`;
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

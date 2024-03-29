import ClassroomCardSkeleton from '@/components/cards/classroom-skeleton/ClassroomCardSkeleton';
import CourseCard from '@/components/cards/course/CourseCard';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { useCoursesFilter } from '@/hooks/courses/useCourses';
import { useDebounce } from '@/hooks/debounce/useDebounce';
import { useUser } from '@/hooks/user/useUser';
import { Course, MyCoursesResponse } from '@/types/types';
import { setToken } from '@/utils/APIHelper';
import { getCourses } from '@/utils/ClassroomService';
import AddIcon from '@mui/icons-material/Add';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { A11y, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NextPageWithLayout } from '../page';

const Courses: NextPageWithLayout = () => {
  const theme = useTheme();
  const medium = useMediaQuery(theme.breakpoints.up('md'));
  const small = useMediaQuery(theme.breakpoints.up('sm'));
  const formContext = useForm<{ search: string }>({
    defaultValues: {
      search: '',
    },
  });
  const { watch } = formContext;
  const searchValue = watch('search');

  const debouncedFilter: string = useDebounce<string>(searchValue, 500);
  const { isSuccess, isError, isLoading, data, refetch } = useCoursesFilter({
    enabled: false,
    filter: debouncedFilter,
  });

  const handleSearchButton = () => {
    refetch();
  };

  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.role.name === 'Student') {
      router.push('/classroom');
    }
  }, [user, router]);

  return (
    <section className="px-10 pt-16 overflow-y-hidden h-screen">
      <Box
        className="classroom-pagination fixed shadow-xl"
        sx={{ zIndex: 9999 }}
      />
      <Container className="slider-wrapper">
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Container className="flex justify-between">
            <Box sx={{ height: '40px', marginTop: 2 }}>
              <Link href="/course/create">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  เพิ่มรายวิชา
                </Button>
              </Link>
            </Box>
            <Box sx={{ height: '40px', marginTop: 2 }}>
              <ButtonGroup size="large" disableElevation>
                <IconButton className="prevBtn">
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton className="nextBtn">
                  <NavigateNextIcon />
                </IconButton>
              </ButtonGroup>
            </Box>
          </Container>
          <Container>
            <FormContainer
              formContext={formContext}
              onSuccess={handleSearchButton}
            >
              <TextFieldElement
                fullWidth
                size="small"
                type="search"
                placeholder="ค้นหารายวิชา"
                autoComplete="off"
                name="search"
                helperText={
                  isSuccess
                    ? debouncedFilter
                      ? `ผลลัพธ์การค้นหา ${data?.length} รายการ`
                      : `จำนวนรายวิชาทั้งหมด ${data?.length} รายการ`
                    : debouncedFilter
                    ? 'กด Enter เพื่อค้นหา'
                    : null
                }
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleSearchButton}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </FormContainer>
          </Container>
        </Stack>
        {isError && 'Something went wrong...'}
        <Swiper
          className="h-full w-full pt-9 px-4"
          modules={[Navigation, Pagination, Mousewheel, Keyboard, A11y]}
          slidesPerView={medium ? 3 : small ? 2 : 1}
          spaceBetween={30}
          mousewheel
          keyboard
          rewind={true}
          scrollbar={{ draggable: true }}
          navigation={{
            prevEl: '.prevBtn',
            nextEl: '.nextBtn',
          }}
          pagination={{
            el: '.classroom-pagination',
            type: 'progressbar',
          }}
        >
          {isLoading &&
            [...Array(3)].map((_, i) => (
              <SwiperSlide key={i} className="mb-96">
                <ClassroomCardSkeleton />
              </SwiperSlide>
            ))}
          {isSuccess &&
            data?.map((course: Course) => (
              <SwiperSlide key={course.id} className="mb-96">
                <CourseCard course={course} loading={isLoading} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default Courses;

Courses.getLayout = (page) => {
  return <PrimaryLayout title="รายวิชาของฉัน">{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const token = await getToken({ req });

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery<MyCoursesResponse>(['courses', ''], () =>
    getCourses()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
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
import ClassroomCardSkeleton from '@/components/cards/classroom-skeleton/ClassroomCardSkeleton';
import ClassroomCard from '@/components/cards/classroom/ClassroomCard';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { useClassroomsFilter } from '@/states/classrooms/useClassrooms';
import { MyClassroom, MyClassroomsResponse } from '@/types/types';
import { getClassrooms } from '@/utils/ClassroomService';
import { useDebounce } from '@/utils/useDebounce';
import { NextPageWithLayout } from '../page';

const Classrooms: NextPageWithLayout = () => {
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
  const { isSuccess, isError, isLoading, data, refetch } = useClassroomsFilter({
    enabled: false,
    filter: debouncedFilter,
  });

  const handleSearchButton = () => {
    refetch();
  };

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
          <Container className="flex justify-end">
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
                placeholder="ค้นหาคลาสเรียน"
                autoComplete="off"
                name="search"
                helperText={
                  isSuccess
                    ? debouncedFilter
                      ? `ผลลัพธ์การค้นหา ${data.classrooms.length + data.invitations.length} รายการ`
                      : `จำนวนคลาสเรียนทั้งหมด ${data.classrooms.length + data.invitations.length} รายการ`
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
            data.classrooms.map((classroom: MyClassroom) => (
              <SwiperSlide key={classroom.id} className="mb-96">
                <ClassroomCard classroom={classroom} loading={isLoading} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default Classrooms;

Classrooms.getLayout = (page) => {
  return <PrimaryLayout title="คลาสเรียนของฉัน">{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const queryClient = new QueryClient();
  await queryClient.fetchQuery<MyClassroomsResponse>(['classrooms', ''], () =>
    getClassrooms()
  );

  if (session?.user.role.name === 'Teacher') {
    return {
      redirect: {
        destination: '/course',
        permanent: true,
      },
    };
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

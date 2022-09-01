import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { A11y, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import PrimaryLayout from '../../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from '../page';

// Import Swiper styles
import AddIcon from '@mui/icons-material/Add';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ClassroomCardSkeleton from '../../components/cards/classroom-skeleton/ClassroomCardSkeleton';
import ClassroomTeacherCard from '../../components/cards/classroom-teacher/ClassroomTeacherCard';
import { useDebounce } from '../../utils/useDebounce';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

const classrooms: any = [
  {
    id: 1,
    name: 'Data Structures',
    semester: 1,
    year: 2565,
    section: [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    instructor: {
      id: 1234,
      username: 'johndoe69',
      firstname: 'John',
      lastname: 'Doe',
      email: 'johnny@kku.edu',
      profile: [
        {
          url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
        },
      ],
    },
    slug: 'YXNkZm9ya3Ys',
  },
];

const Classroom: NextPageWithLayout = () => {
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

  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(true);
  const debouncedSearchTerm: string = useDebounce<string>(searchValue, 500);

  useEffect(() => {
    setTimeout(() => setIsSearching(false), 1500);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      let res = classrooms.filter((classroom: any) => {
        let filter = debouncedSearchTerm.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          '\\$&'
        );
        let rule = new RegExp(filter, 'i');
        return (
          rule.test(classroom.name) ||
          rule.test(classroom.instructor.firstname) ||
          rule.test(classroom.instructor.lastname)
        );
      });
      setTimeout(() => setIsSearching(false), 500);
      setResults(res);
    } else {
      setResults(classrooms);
    }
  }, [debouncedSearchTerm]);

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
              <Button size="small" variant="contained" startIcon={<AddIcon />}>
                สร้างคลาสเรียน
              </Button>
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
            <FormContainer formContext={formContext}>
              <TextFieldElement
                fullWidth
                size="small"
                type="search"
                placeholder="search"
                autoComplete="off"
                name="search"
                helperText={
                  !isSearching
                    ? debouncedSearchTerm
                      ? `ผลลัพธ์การค้นหา ${results.length} รายการ`
                      : `จำนวนคลาสเรียนทั้งหมด ${results.length} รายการ`
                    : null
                }
                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
              />
            </FormContainer>
          </Container>
        </Stack>
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
          {!isSearching
            ? results.map((classroom) => (
                <SwiperSlide key={classroom.id} className="mb-96">
                  <ClassroomTeacherCard
                    classroom={classroom}
                    loading={isSearching}
                  />
                </SwiperSlide>
              ))
            : [...Array(3)].map((x, i) => (
                <SwiperSlide key={i} className="mb-96">
                  <ClassroomCardSkeleton />
                </SwiperSlide>
              ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default Classroom;

Classroom.getLayout = (page) => {
  return <PrimaryLayout title="คลาสเรียนของฉัน">{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const session = await getSession(context);

  if (session?.user.role.name !== "Teacher") {
    return {
      redirect: {
        destination: '/classroom',
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};
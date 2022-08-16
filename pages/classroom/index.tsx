import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { A11y, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ClassroomCard from '../../components/cards/classroom/ClassroomCard';
import PrimaryLayout from '../../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from '../page';

// Import Swiper styles
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SxProps } from '@mui/system';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ClassroomCardSkeleton from '../../components/cards/classroom-skeleton/ClassroomCardSkeleton';
import { useDebounce } from '../../utils/useDebounce';

type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  profile: [
    {
      url: string;
    }
  ];
};

type Course = {
  id: number;
  code: string;
  name: string;
  semester: number;
  year: number;
  classroom: ClassroomType[];
};

type ClassroomType = {
  id: number;
  section: string;
  classroomProblems?: Problem[];
  students?: User;
};

type Problem = {
  id: number;
};

type StudentSubmission = {
  id: number;
  student: User;
  submission: Submission;
  success: boolean;
};

type Submission = {
  id: number;
  status: number;
};

type FakeClassroom = {
  id: number;
  name: string;
  semester: number;
  year: number;
  section: number;
  coverImageUrl: string;
  instructor: User;
  success: number;
  slug: string;
};

const classrooms: FakeClassroom[] = [
  {
    id: 1,
    name: 'Data Structures',
    semester: 1,
    year: 2565,
    section: 2,
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
    success: 91.67,
    slug: 'YXNkZm9ya3Ys',
  },
  {
    id: 2,
    name: 'Cyber Security',
    semester: 1,
    year: 2565,
    section: 1,
    coverImageUrl:
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    instructor: {
      id: 1235,
      username: 'bobby',
      firstname: 'Albert',
      lastname: 'Bob',
      email: 'bobby@kku.edu',
      profile: [
        {
          url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80',
        },
      ],
    },
    success: 75,
    slug: 'aGVsbG93b3JsZA',
  },
  {
    id: 3,
    name: 'วิทยาการคำนวณ',
    semester: 1,
    year: 2565,
    section: 3,
    coverImageUrl:
      'https://images.unsplash.com/photo-1597008641621-cefdcf718025?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1939&q=80',
    instructor: {
      id: 1236,
      username: 'somsak1112',
      firstname: 'สมศักดิ์',
      lastname: 'เกรดเด้อ',
      email: 'somsak@kku.edu',
      profile: [
        {
          url: 'https://i.pravatar.cc/',
        },
      ],
    },
    success: 100,
    slug: 'c2dvb2RieWU',
  },
  {
    id: 1333,
    name: 'Database Design',
    semester: 1,
    year: 2565,
    section: 4,
    coverImageUrl:
      'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    instructor: {
      id: 1234,
      username: 'somsakjung',
      firstname: 'อัลเบิร์ต',
      lastname: 'สมศักดิ์',
      email: 'somsakjung@kku.edu',
      profile: [
        {
          url: 'https://i.pravatar.cc/?u=somsak',
        },
      ],
    },
    success: 66.67,
    slug: 'somsak-class',
  },
  {
    id: 1334,
    name: 'Data Engineer',
    semester: 1,
    year: 2565,
    section: 8,
    coverImageUrl:
      'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    instructor: {
      id: 1234,
      username: 'johndoe69',
      firstname: 'สมหญิง',
      lastname: 'กระทิงเขียว',
      email: 'yingkaa91@kku.edu',
      profile: [
        {
          url: 'https://i.pravatar.cc/?u=somying',
        },
      ],
    },
    success: 18.67,
    slug: 'YXNkZm9ya3Ys',
  },
  {
    id: 1335,
    name: 'Information & Data Security',
    semester: 2,
    year: 2565,
    section: 1,
    coverImageUrl:
      'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    instructor: {
      id: 1234,
      username: 'monkey_d_somporn',
      firstname: 'มังกี้ ดี',
      lastname: 'สมพร',
      email: 'sompornhub@kku.edu',
      profile: [
        {
          url: 'https://i.pravatar.cc/?u=somporn',
        },
      ],
    },
    success: 18.67,
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
    return () => {
      setTimeout(() => setIsSearching(false), 1500);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      let res = classrooms.filter((classroom) => {
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
                  <ClassroomCard classroom={classroom} loading={isSearching} />
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

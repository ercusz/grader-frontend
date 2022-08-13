import {
  Box,
  Button,
  Container,
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
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/keyboard';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
];

const NavigationButton = ({
  className,
  text,
}: {
  className: string;
  text: string;
}) => {
  return (
    <Button
      className={`
            transition-all ease-in-out duration-300
            font-extrabold text-2xl
            hover:text-transparent
            hover:bg-clip-text
            hover:bg-gradient-to-r
            hover:from-pink-500
            hover:via-red-500
            hover:to-yellow-500
            hover:font-black ${className}`}
      size="large"
      disableRipple
      disableElevation
      sx={{
        '&.MuiButtonBase-root:hover': {
          bgcolor: 'transparent',
        },
      }}
    >
      {text}
    </Button>
  );
};

const Classroom: NextPageWithLayout = () => {
  const theme = useTheme();
  const medium = useMediaQuery(theme.breakpoints.up('md'));
  const small = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <section className="px-10 pt-16 overflow-y-hidden h-screen">
      <Box
        className="classroom-pagination fixed shadow-xl"
        sx={{ zIndex: 9999 }}
      />
      <Typography
        className="font-black px-2"
        component="h1"
        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
      >
        คลาสเรียนของฉัน
      </Typography>
      <Container className="slider-wrapper">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <NavigationButton className="prevBtn" text="Back" />
          <NavigationButton className="nextBtn" text="Next" />
        </Stack>
        <Swiper
          className="h-full w-full pt-9 px-4"
          modules={[Navigation, Pagination, Mousewheel, Keyboard, A11y]}
          slidesPerView={medium ? 3 : small ? 2 : 1}
          spaceBetween={30}
          mousewheel
          keyboard
          loop
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
          {classrooms.map((classroom) => (
            <SwiperSlide key={classroom.id} className="mb-96">
              <ClassroomCard classroom={classroom} />
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

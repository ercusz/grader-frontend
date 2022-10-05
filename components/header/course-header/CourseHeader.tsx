import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useClassroomSlug } from '../../../state/classrooms/useClassrooms';

export interface ICourseHeader {
  classroomSlug?: string;
}

const CourseHeader: React.FC<ICourseHeader> = ({ classroomSlug }) => {
  const {
    isLoading,
    isSuccess,
    data: classroom,
  } = useClassroomSlug({ slug: classroomSlug });

  const course = {
    id: 1,
    name: 'Data Structures',
    semester: 1,
    year: 2565,
    section: [
      {
        id: 1,
        name: 'Section 1',
      },
      {
        id: 2,
        name: 'Section 2',
      },
      {
        id: 3,
        name: 'Section พิเศษ',
      },
    ],
    coverImageUrl:
      'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    instructor: {
      id: 1234,
      username: 'johndoe69',
      email: 'johnny@kku.edu',
      studentId: null,
      firstName: 'John',
      lastName: 'Doe',
      role: {
        id: 999999,
        name: 'Teacher',
      },
      profileImage: {
        id: 1,
        url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
      },
    },
    slug: 'YXNkZm9ya3Ys',
  };

  return (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${course?.coverImageUrl})`,
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      />
      <Grid container>
        <Grid item md={6}>
          <Box
            sx={{
              position: 'relative',
              pt: 14,
              px: { xs: 3, md: 6 },
              pb: 1,
            }}
          >
            {classroom && (
              <Chip
                color="primary"
                label={
                  <Typography className="font-bold" color="inherit">
                    {classroom.name}
                  </Typography>
                }
              />
            )}
            <Typography
              className="font-bold"
              component="h1"
              variant="h3"
              color="inherit"
              noWrap
              gutterBottom
            >
              {course.name}
              <Tooltip title="แก้ไขข้อมูลรายวิชา">
                <IconButton
                  aria-label="edit course info"
                  color="inherit"
                  size="large"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              {`${course.semester}/${course.year}`}
            </Typography>
            <Typography variant="subtitle1" color="inherit" paragraph>
              {`ผู้สอน: ${course.instructor.firstName} ${course.instructor.lastName}`}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CourseHeader;

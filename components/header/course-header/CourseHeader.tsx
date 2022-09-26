import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { Course } from '../../../types/types';

export interface ICourseHeader {
  course: Course;
}

const CourseHeader: React.FC<ICourseHeader> = ({ course }) => {
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
              px: { xs: 3, md: 6 },
              pb: 1,
              pr: { md: 0 },
            }}
          >
            <Typography
              className="font-bold"
              sx={{ pt: 14 }}
              component="h1"
              variant="h3"
              color="inherit"
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
              {`ผู้สอน: ${course.instructor.first_name} ${course.instructor.last_name}`}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CourseHeader;

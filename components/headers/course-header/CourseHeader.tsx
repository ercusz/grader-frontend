import EditCourseInfoDialog from '@/components/dialogs/edit-course-info/EditCourseInfoDialog';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useCourseSlug } from '@/hooks/courses/useCourses';
import { useUser } from '@/hooks/user/useUser';
import { openEditCourseDialogAtom } from '@/stores/edit-course';
import { getImagePath } from '@/utils/imagePath';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';

export interface ICourseHeader {
  classroomSlug?: string;
  courseSlug?: string;
}

const CourseHeader: React.FC<ICourseHeader> = ({
  classroomSlug,
  courseSlug,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const { data: user } = useUser();

  const [, setOpenEditCourseDialog] = useAtom(openEditCourseDialogAtom);

  const getCoverImage = () => {
    if (
      classroom &&
      classroom.course &&
      classroom.course.coverImage &&
      classroom.course.coverImage.url
    ) {
      return `url(${getImagePath(classroom.course.coverImage)})`;
    } else if (course && course.coverImage && course.coverImage.url) {
      return `url(${getImagePath(course.coverImage)})`;
    }

    return '';
  };

  const getName = () => {
    if (classroom && classroom.course) {
      return classroom.course.name;
    } else if (course) {
      return course.name;
    }

    return '';
  };

  const getSemesterYear = () => {
    if (
      classroom &&
      classroom.course &&
      classroom.course.semester &&
      classroom.course.year
    ) {
      return `${classroom.course.semester}/${classroom.course.year}`;
    } else if (course && course.semester && course.year) {
      return `${course.semester}/${course.year}`;
    }

    return '';
  };

  const getTeacher = () => {
    if (
      classroom &&
      classroom.course &&
      classroom.course.teachers[0].firstName &&
      classroom.course.teachers[0].lastName
    ) {
      const { course } = classroom;
      return `ผู้สอน: ${course.teachers[0].firstName} ${course.teachers[0].lastName}`;
    } else if (
      course &&
      course.teachers &&
      course.teachers[0].firstName &&
      course.teachers[0].lastName
    ) {
      return `ผู้สอน: ${course.teachers[0].firstName} ${course.teachers[0].lastName}`;
    }

    return '';
  };

  return (
    <>
      <EditCourseInfoDialog
        classroomSlug={classroomSlug}
        courseSlug={courseSlug}
      />
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
          backgroundImage: getCoverImage(),
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
        <Container
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
          <Stack direction="row" alignItems="center">
            <Typography
              className="font-bold"
              component="h1"
              variant="h3"
              color="inherit"
              noWrap
              gutterBottom
            >
              {getName()}
            </Typography>
            {user?.role.name === 'Teacher' && (
              <Tooltip
                title={`แก้ไขข้อมูล${classroom ? 'กลุ่มการเรียน' : 'รายวิชา'}`}
              >
                <IconButton
                  aria-label="edit course info"
                  color="inherit"
                  size="large"
                  onClick={() => setOpenEditCourseDialog(true)}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <Typography variant="h5" color="inherit" paragraph>
            {getSemesterYear()}
          </Typography>
          <Typography variant="subtitle1" color="inherit" paragraph>
            {getTeacher()}
          </Typography>
        </Container>
      </Paper>
    </>
  );
};

export default CourseHeader;

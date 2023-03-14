import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { Assignment } from '@/types/types';
import { deleteAssignmentTopic } from '@/utils/TopicServices';
import AlarmIcon from '@mui/icons-material/Alarm';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  format,
  formatDistanceToNow,
  isFuture,
  isPast,
  isValid,
  parseISO,
} from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

export interface ISubtaskCard {
  assignment: Assignment;
  classroomSlug: string;
  isTeacherTA: boolean;
}

const SubtaskCard: React.FC<ISubtaskCard> = ({
  assignment,
  classroomSlug,
  isTeacherTA,
}) => {
  const theme = useTheme();
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });

  const router = useRouter();
  const id = router.query.id as string;

  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    () =>
      deleteAssignmentTopic(
        id,
        classroom?.id.toString() as string,
        assignment.id.toString() as string
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topic', { id: id }]);
        queryClient.invalidateQueries(['topics']);
        queryClient.invalidateQueries(['assignment', { id: assignment.id }]);
        queryClient.invalidateQueries(['assignments']);
        alert('นำงานย่อยออกจากหัวข้อนี้เรียบร้อยแล้ว');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการนำงานย่อยออกจากหัวข้อนี้');
      },
    }
  );

  const handleDeleteAssignment = () => {
    if (confirm('คุณต้องการนำงานย่อยนี้ออกจากหัวข้อนี้ใช่หรือไม่?')) {
      deleteMutation.mutate();
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const renderTaskStatus = () => {
    if (
      !assignment ||
      !isValid(parseISO(assignment.startDate)) ||
      !isValid(parseISO(assignment.endDate))
    ) {
      return null;
    }

    if (isTeacherTA) {
      if (isFuture(parseISO(assignment.startDate))) {
        return (
          <Tooltip
            arrow
            title={
              'โพสต์นี้จะไม่ปรากฏให้นักศึกษาในคลาสเรียนเห็นจนกว่าจะถึงวันเวลาที่เริ่มเผยแพร่'
            }
          >
            <Chip
              size="small"
              color="warning"
              icon={<InsertDriveFileIcon />}
              label="DRAFT"
              variant="outlined"
            />
          </Tooltip>
        );
      }

      return null;
    }

    if (assignment.isSubmitted) {
      return (
        <Chip
          color="success"
          variant="outlined"
          size="small"
          icon={<CheckCircleIcon />}
          label={'ส่งแล้ว'}
        />
      );
    } else {
      if (isPast(parseISO(assignment.endDate))) {
        return (
          <Chip
            color="error"
            variant="outlined"
            size="small"
            icon={<AlarmIcon />}
            label={'เกินกำหนด'}
          />
        );
      } else {
        return (
          <Chip
            color="warning"
            variant="outlined"
            size="small"
            icon={<AlarmIcon />}
            label={'ยังไม่ส่ง'}
          />
        );
      }
    }
  };

  return (
    <>
      <Card
        className="h-44 w-full 
            content-between rounded-3xl
            transition-all ease-in-out delay-150 
            duration-300 hover:shadow-sm hover:outline-2"
        variant="outlined"
        key={assignment.id}
        sx={{
          boxShadow: `4px 4px 10px ${
            theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.219)'
              : 'rgba(255, 255, 255, 0.1)'
          }`,
        }}
      >
        <Link
          href={`/classroom/${classroomSlug}/assignments/${assignment.id}`}
          passHref
        >
          <CardActionArea
            component="a"
            sx={{
              height: '100%',
            }}
          >
            <CardHeader
              title={
                <>
                  {assignment.type === 'java-src' && (
                    <Tooltip title="ซอร์สโค้ด" arrow>
                      <Avatar className="shadow-md bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500 via-red-500 to-yellow-500">
                        <CodeIcon />
                      </Avatar>
                    </Tooltip>
                  )}
                  {assignment.type === 'docs' && (
                    <Tooltip title="เอกสาร" arrow>
                      <Avatar className="shadow-md bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900">
                        <AssignmentIcon />
                      </Avatar>
                    </Tooltip>
                  )}
                  <Typography
                    className="font-black leading-loose tracking-wide"
                    variant="body1"
                    component="div"
                    noWrap
                  >
                    {assignment.title}
                  </Typography>
                </>
              }
              action={
                isTeacherTA && (
                  <IconButton
                    aria-label="settings"
                    onTouchStart={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handleMoreButtonClick(event);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )
              }
              sx={{
                display: 'flex',
                overflow: 'hidden',
                '& .MuiCardHeader-content': {
                  overflow: 'hidden',
                },
              }}
            />
            <CardContent>
              {isValid(parseISO(assignment.endDate)) && (
                <Tooltip
                  title={`กำหนดส่ง ${formatDistanceToNow(
                    parseISO(assignment.endDate),
                    {
                      locale: th,
                      addSuffix: true,
                    }
                  )}`}
                  arrow
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{
                      width: 'fit-content',
                      color:
                        !isTeacherTA && !assignment.isSubmitted
                          ? isPast(parseISO(assignment.endDate))
                            ? 'error.main'
                            : 'text.secondary'
                          : 'text.secondary',
                    }}
                  >
                    <AlarmIcon fontSize="inherit" />
                    <Typography
                      sx={{
                        typography: { xs: 'caption', md: 'body2' },
                      }}
                      noWrap
                    >
                      {`${format(parseISO(assignment.endDate), 'PPp', {
                        locale: th,
                      })}`}
                    </Typography>
                  </Stack>
                </Tooltip>
              )}
            </CardContent>

            <CardActions
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
              }}
            >
              {renderTaskStatus()}
            </CardActions>
          </CardActionArea>
        </Link>
      </Card>
      {isTeacherTA && (
        <Menu
          id="subtask-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'subtask-menu',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleDeleteAssignment()} disableRipple>
            <Typography
              color="error"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <DeleteIcon fontSize="inherit" sx={{ mr: 1 }} />
              นำออกจากหัวข้อนี้
            </Typography>
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default SubtaskCard;

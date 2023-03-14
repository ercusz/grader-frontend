import { Assignment } from '@/types/types';
import AlarmIcon from '@mui/icons-material/Alarm';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import { format, isFuture, isPast, isValid, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';

export interface IAssignmentCard {
  assignment: Assignment;
  classroomSlug: string;
  isTeacherTA: boolean;
}

const AssignmentCard: React.FC<IAssignmentCard> = ({
  assignment,
  classroomSlug,
  isTeacherTA,
}) => {
  const renderStatus = () => {
    if (
      !assignment ||
      !isValid(parseISO(assignment.startDate)) ||
      !isValid(parseISO(assignment.endDate))
    ) {
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
    <Card className="shadow-md w-full" variant="outlined">
      <Link
        href={`/classroom/${classroomSlug}/assignments/${assignment.id}`}
        passHref
      >
        <CardActionArea component="a">
          <CardHeader
            sx={{
              display: 'flex',
              overflow: 'hidden',
              '& .MuiCardHeader-content': {
                overflow: 'hidden',
              },
            }}
            avatar={
              <Avatar aria-label="assignment">
                {assignment.type == 'java-src' && <CodeIcon />}
                {assignment.type == 'docs' && <AssignmentIcon />}
              </Avatar>
            }
            title={
              <Typography noWrap gutterBottom variant="subtitle2">
                {`${assignment.createBy.firstName} ${assignment.createBy.lastName}`}
                {` ได้มอบหมายงานใหม่ `}
                {`${assignment.title}`}
              </Typography>
            }
            action={
              isTeacherTA &&
              isFuture(parseISO(assignment.startDate)) && (
                <Tooltip
                  arrow
                  title={
                    'โพสต์นี้จะไม่ปรากฏให้นักศึกษาในคลาสเรียนเห็นจนกว่าจะถึงวันเวลาที่เริ่มการส่งงาน'
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
              )
            }
            subheader={format(parseISO(assignment.createdAt), 'PPp', {
              locale: th,
            })}
          />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {renderStatus()}
          </CardActions>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default AssignmentCard;

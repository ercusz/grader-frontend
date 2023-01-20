import { Assignment } from '@/types/types';
import AssignmentIcon from '@mui/icons-material/Assignment';
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
import { format, isFuture, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';

export interface IAssignmentCard {
  assignment: Assignment;
  classroomSlug: string;
}

const AssignmentCard: React.FC<IAssignmentCard> = ({
  assignment,
  classroomSlug,
}) => {
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
              isFuture(parseISO(assignment.startDate)) && (
                <Tooltip
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
            {/* <Typography variant="caption" sx={{ pr: 1 }}>
              แท็ก
            </Typography>
            <Chip label={'บทที่ 1'} size="small" /> */}
          </CardActions>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default AssignmentCard;

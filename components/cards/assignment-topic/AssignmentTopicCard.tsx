import { TopicWithAssignments } from '@/types/types';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Chip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import styles from './AssignmentTopicCard.module.css';

export interface IAssignmentTopicCard {
  topic: TopicWithAssignments;
  classroomSlug: string;
}

const AssignmentTopicCard: React.FC<IAssignmentTopicCard> = ({
  topic,
  classroomSlug,
}) => {
  const theme = useTheme();

  return (
    <Card
      className={`w-full ${
        theme.palette.mode === 'light' ? styles.paperLight : styles.paperDark
      }`}
      variant="outlined"
    >
      <Link href={`/classroom/${classroomSlug}/topics/${topic.id}`} passHref>
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
                <LibraryBooksIcon />
              </Avatar>
            }
            title={
              topic.assignments[0] && (
                <Typography noWrap gutterBottom variant="subtitle2">
                  {`${topic.assignments[0].createBy.firstName} ${topic.assignments[0].createBy.lastName}`}
                  {` ได้มอบหมายงานใหม่ `}
                  {`${topic.name}`}
                </Typography>
              )
            }
            subheader={format(parseISO(topic.createdAt), 'PPp', {
              locale: th,
            })}
          />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Chip
              label={
                <Typography variant="caption">
                  งานย่อยทั้งหมด {topic.assignments.length} งาน
                </Typography>
              }
              size="small"
            />
          </CardActions>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default AssignmentTopicCard;

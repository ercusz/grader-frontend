import { Topic } from '@/types/types';
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
import { useMemo } from 'react';
import styles from './TopicCard.module.css';

export interface ITopicCard {
  topic: Topic;
  classroomSlug: string;
}

const TopicCard: React.FC<ITopicCard> = ({ topic, classroomSlug }) => {
  const theme = useTheme();

  const author = useMemo(() => {
    if (topic.assignments && topic.assignments[0]) {
      return `${topic.assignments[0].createBy.firstName} ${topic.assignments[0].createBy.lastName}`;
    }

    if (topic.materials && topic.materials[0]) {
      return `${topic.materials[0].createBy.firstName} ${topic.materials[0].createBy.lastName}`;
    }

    return '';
  }, [topic]);

  const action = useMemo(() => {
    if (
      topic.assignments &&
      topic.assignments[0] &&
      topic.materials &&
      topic.materials[0]
    ) {
      return ' ได้มอบหมายงานและเพิ่มเอกสารใหม่ ใน ';
    }
    if (topic.assignments && topic.assignments[0]) {
      return ' ได้มอบหมายงานใหม่ ใน ';
    }

    if (topic.materials && topic.materials[0]) {
      return ' ได้เพิ่มเอกสารใหม่ ใน ';
    }

    return '';
  }, [topic]);

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
              <Typography noWrap gutterBottom variant="subtitle2">
                {author + action + topic.name}
              </Typography>
            }
            subheader={format(parseISO(topic.createdAt), 'PPp', {
              locale: th,
            })}
          />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {topic.assignments && (
              <Chip
                label={
                  <Typography variant="caption">
                    {topic.assignments.length} งานย่อย
                  </Typography>
                }
                size="small"
              />
            )}
            {topic.materials && (
              <Chip
                label={
                  <Typography variant="caption">
                    {topic.materials.length} เอกสาร
                  </Typography>
                }
                size="small"
              />
            )}
          </CardActions>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default TopicCard;

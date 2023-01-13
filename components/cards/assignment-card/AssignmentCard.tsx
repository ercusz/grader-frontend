import { Assignment } from '@/types/types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';

export interface IAssignmentCard {
  assignment: Assignment;
}

const AssignmentCard: React.FC<IAssignmentCard> = ({ assignment }) => {
  const router = useRouter();
  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Card className="shadow-md w-full" variant="outlined">
      <Link href={`${router.asPath}/${assignment.id}`} passHref>
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
            action={
              <IconButton
                onTouchStart={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(e) => {
                  handleMoreButtonClick(e);
                }}
                aria-label="more"
              >
                <MoreVertIcon />
              </IconButton>
            }
            title={
              <Typography noWrap gutterBottom variant="subtitle2">
                {`${assignment.createdBy.firstName} ${assignment.createdBy.lastName}`}
                {` ได้มอบหมายงานใหม่ `}
                {`${assignment.title}`}
              </Typography>
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

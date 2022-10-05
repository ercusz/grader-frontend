import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { MouseEvent } from 'react';

export interface IAssignmentCard {
  idx: number;
}

const AssignmentCard: React.FC<IAssignmentCard> = ({ idx }) => {
  // const [_, setPage] = useAtom(pageAtom);

  const stopPropagation = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const handleAssignmentChipClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // setPage(2);
  };

  const handleMaterialChipClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // setPage(3);
  };

  return (
    <Card className="shadow-md w-full" variant="outlined">
      <Link href="#" passHref>
        <CardActionArea>
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
                <AssignmentIcon />
              </Avatar>
            }
            action={
              <IconButton
                onClick={(e) => {
                  stopPropagation(e);
                }}
                aria-label="settings"
              >
                <MoreVertIcon />
              </IconButton>
            }
            title={
              <Typography noWrap gutterBottom variant="subtitle2">
                {`${'John Doe'} ได้มอบหมายงานใหม่ ${`Lab ${idx} - Lorem ipsum dolor sit amet, consectetur adipisicing elit. A nobis dolorem nostrum soluta. Doloribus quaerat, eius voluptatibus assumenda eaque illo illum, labore at itaque ex, nemo repellat cupiditate praesentium explicabo!`}`}
              </Typography>
            }
            subheader="September 14, 2016"
          />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Typography variant="caption" sx={{ pr: 1 }}>
              แท็ก
            </Typography>
            <Tooltip title={`แสดงหมวดหมู่ ${"บทที่ 1"}`}>
              <Chip
                label={"บทที่ 1"}
                size="small"
                onClick={handleAssignmentChipClick}
              />
            </Tooltip>
          </CardActions>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default AssignmentCard;

import { Material } from '@/types/types';
import BookIcon from '@mui/icons-material/Book';
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

export interface IMaterialCard {
  material: Material;
  classroomSlug: string;
  isTeacherTA: boolean;
}

const MaterialCard: React.FC<IMaterialCard> = ({
  material,
  classroomSlug,
  isTeacherTA,
}) => {
  return (
    <Card className="shadow-md w-full" variant="outlined">
      <Link
        href={`/classroom/${classroomSlug}/materials/${material.id}`}
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
              <Avatar aria-label="material">
                <BookIcon />
              </Avatar>
            }
            title={
              <Typography noWrap gutterBottom variant="subtitle2">
                {`${material.createBy.firstName} ${material.createBy.lastName}`}
                {` ได้โพสต์เอกสารใหม่ `}
                {`${material.title}`}
              </Typography>
            }
            action={
              isTeacherTA &&
              isFuture(parseISO(material.publishedDate)) && (
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
            subheader={format(parseISO(material.createdAt), 'PPp', {
              locale: th,
            })}
          />
          <CardActions sx={{ justifyContent: 'flex-end' }}></CardActions>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default MaterialCard;

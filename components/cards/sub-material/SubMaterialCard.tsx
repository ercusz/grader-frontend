import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { Material } from '@/types/types';
import { deleteMaterialTopic } from '@/utils/TopicServices';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isFuture, parseISO } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

export interface ISubMaterialCard {
  material: Material;
  classroomSlug: string;
  isTeacherTA: boolean;
}

const SubMaterialCard: React.FC<ISubMaterialCard> = ({
  material,
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
      deleteMaterialTopic(
        id,
        classroom?.id.toString() as string,
        material.id.toString() as string
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topic', { id: id }]);
        queryClient.invalidateQueries(['topics']);
        queryClient.invalidateQueries(['material', { id: material.id }]);
        queryClient.invalidateQueries(['materials']);
        alert('นำเอกสารออกจากหัวข้อนี้เรียบร้อยแล้ว');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการนำเอกสารออกจากหัวข้อนี้');
      },
    }
  );

  const handleDeleteMaterial = () => {
    if (confirm('คุณต้องการนำเอกสารนี้ออกจากหัวข้อนี้ใช่หรือไม่?')) {
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

  return (
    <>
      <Card
        className="h-44 w-full 
            content-between rounded-3xl
            transition-all ease-in-out delay-150 
            duration-300 hover:shadow-sm hover:outline-2"
        variant="outlined"
        key={material.id}
        sx={{
          boxShadow: `4px 4px 10px ${
            theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.219)'
              : 'rgba(255, 255, 255, 0.1)'
          }`,
        }}
      >
        <Link
          href={`/classroom/${classroomSlug}/materials/${material.id}`}
          passHref
        >
          <CardActionArea component="a" sx={{ height: '100%' }}>
            <CardHeader
              title={
                <>
                  <Tooltip title="เอกสารประกอบการสอน" arrow>
                    <Avatar className="shadow-md bg-gradient-to-l from-green-500 to-green-700">
                      <BookIcon />
                    </Avatar>
                  </Tooltip>
                  <Typography
                    className="font-black leading-loose tracking-wide"
                    variant="body1"
                    component="div"
                    noWrap
                  >
                    <Tooltip title={material.title} arrow>
                      <span>{material.title}</span>
                    </Tooltip>
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
            <CardActions
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 4,
              }}
            >
              {isTeacherTA && isFuture(parseISO(material.publishedDate)) && (
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
              )}
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
          <MenuItem onClick={() => handleDeleteMaterial()} disableRipple>
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

export default SubMaterialCard;

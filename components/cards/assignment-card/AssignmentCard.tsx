import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { Assignment, User, UserResponse } from '@/types/types';
import { getUserRole } from '@/utils/role';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';

export interface IAssignmentCard {
  assignment: Assignment;
  classroomSlug: string;
}

const AssignmentCard: React.FC<IAssignmentCard> = ({
  assignment,
  classroomSlug,
}) => {
  const { data: user } = useUser();
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const getRole = (targetUser: UserResponse | User) => {
    return getUserRole({
      teachers: classroom?.course.teachers || ([] as UserResponse[]),
      teacherAssistants: classroom?.teacherAssistants || ([] as UserResponse[]),
      students: classroom?.students || ([] as UserResponse[]),
      targetUser: targetUser,
    });
  };

  return (
    <>
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
              action={
                ((user && getRole(user) === Roles.TEACHER) ||
                  (user && getRole(user) === Roles.TA)) && (
                  <Tooltip title="ตัวเลือก">
                    <IconButton
                      aria-label="more"
                      aria-controls="assignment-menu"
                      aria-haspopup="true"
                      onClick={handleMoreButtonClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                )
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
      <Menu
        id="post-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'post-menu',
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
        {((user && getRole(user) === Roles.TEACHER) ||
          (user && getRole(user) === Roles.TA)) && (
          <>
            <MenuItem onClick={() => alert('แก้ไข')} dense disableRipple>
              <EditIcon fontSize="inherit" sx={{ mr: 1 }} />
              แก้ไข
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => alert('ลบ')} dense disableRipple>
              <DeleteIcon color="error" fontSize="inherit" sx={{ mr: 1 }} />
              <Typography color="error" variant="body2">
                ลบ
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default AssignmentCard;

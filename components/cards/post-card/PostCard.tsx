import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { Post, User, UserResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import { getUserRole } from '@/utils/role';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { format, formatDistanceToNow, isAfter, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';

export interface IPostCard {
  compact?: boolean;
  post: Post;
  classroomSlug: string;
}

const PostCard: React.FC<IPostCard> = ({ compact, post, classroomSlug }) => {
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
        <CardHeader
          sx={{
            display: 'flex',
            overflow: 'hidden',
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            },
          }}
          avatar={
            <Link href={`/p/@${post.createBy?.username}`} passHref>
              <MuiLink>
                <Avatar
                  alt={
                    post.createBy
                      ? `${post.createBy?.username}'s profile image`
                      : undefined
                  }
                  src={getImagePath(post.createBy.profileImage)}
                >
                  {post.createBy &&
                  post.createBy.firstName &&
                  post.createBy.lastName
                    ? post.createBy.firstName?.charAt(0) +
                      post.createBy.lastName?.charAt(0)
                    : post.createBy.username?.charAt(0)}
                </Avatar>
              </MuiLink>
            </Link>
          }
          action={
            ((user && getRole(user) === Roles.TEACHER) ||
              (user && getRole(user) === Roles.TA) ||
              (user && user.id === post.createBy?.id)) && (
              <Tooltip title="ตัวเลือก">
                <IconButton
                  aria-label="more"
                  aria-controls="post-menu"
                  aria-haspopup="true"
                  onClick={handleMoreButtonClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )
          }
          title={
            <Link href={`/p/@${post.createBy?.username}`} passHref>
              <MuiLink underline="hover">
                <Typography noWrap variant="subtitle2" component="span">
                  {post.createBy &&
                    post.createBy.firstName + ' ' + post.createBy.lastName}
                </Typography>
              </MuiLink>
            </Link>
          }
          subheader={
            <Stack
              direction="row"
              divider={<Typography variant="caption">·</Typography>}
              alignItems="center"
              spacing={0.5}
            >
              <Link href={`/p/@${post.createBy?.username}`} passHref>
                <MuiLink underline="hover">
                  <Typography noWrap variant="caption" color="textSecondary">
                    @{post.createBy?.username}
                  </Typography>
                </MuiLink>
              </Link>
              <Tooltip
                title={format(parseISO(post.updatedAt), 'PPPPp', {
                  locale: th,
                })}
              >
                <Typography className="cursor-pointer" noWrap variant="caption">
                  {isAfter(parseISO(post.updatedAt), parseISO(post.createdAt))
                    ? 'แก้ไขล่าสุดเมื่อ '
                    : 'โพสต์เมื่อ '}
                  {formatDistanceToNow(parseISO(post.updatedAt), {
                    locale: th,
                    addSuffix: true,
                  })}
                </Typography>
              </Tooltip>
            </Stack>
          }
        />
        <CardContent>
          <Typography
            variant="body1"
            sx={
              compact
                ? {
                    whiteSpace: 'break-spaces',
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 4,
                  }
                : {
                    whiteSpace: 'break-spaces',
                  }
            }
          >
            {post.content}
          </Typography>
        </CardContent>
        {!compact ? (
          <CardActions sx={{ px: 3 }}>
            <IconButton size="small" sx={{ ml: -1 }}>
              <Avatar
                alt={user ? `${user?.username}'s profile image` : undefined}
                src={user?.profileImage ? user.profileImage.url : undefined}
                sx={{ width: 24, height: 24 }}
              >
                {user && user.firstName && user.lastName
                  ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
                  : user?.username?.charAt(0)}
              </Avatar>
            </IconButton>
            <TextField
              size="small"
              placeholder="เขียนความคิดเห็น…"
              multiline
              sx={{ flexGrow: 1, mr: 1, '& fieldset': { border: 'none' } }}
            />
            <Button disabled variant="text">
              โพสต์
            </Button>
          </CardActions>
        ) : (
          <CardActions>
            <Link href={`#${post.id}`} passHref>
              <Button variant="text" sx={{ borderRadius: '20px' }}>
                ดูโพสต์
              </Button>
            </Link>
          </CardActions>
        )}
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
        {user && user.id === post.createBy?.id && (
          <MenuItem onClick={() => alert('แก้ไข')} dense disableRipple>
            <EditIcon fontSize="inherit" sx={{ mr: 1 }} />
            แก้ไข
          </MenuItem>
        )}
        {((user && getRole(user) === Roles.TEACHER) ||
          (user && getRole(user) === Roles.TA)) && [
          post.isPinned ? (
            <MenuItem
              key="post-menu-unpin"
              onClick={() => alert('ยกเลิกปักหมุด')}
              dense
              disableRipple
            >
              <PushPinIcon fontSize="inherit" sx={{ mr: 1 }} />
              ยกเลิกปักหมุด
            </MenuItem>
          ) : (
            <MenuItem
              key="post-menu-pin"
              onClick={() => alert('ปักหมุด')}
              dense
              disableRipple
            >
              <PushPinIcon fontSize="inherit" sx={{ mr: 1 }} />
              ปักหมุด
            </MenuItem>
          ),
          <Divider key="post-menu-divider" />,
          <MenuItem
            key="post-menu-delete"
            onClick={() => alert('ลบ')}
            dense
            disableRipple
          >
            <DeleteIcon color="error" fontSize="inherit" sx={{ mr: 1 }} />
            <Typography color="error" variant="body2">
              ลบ
            </Typography>
          </MenuItem>,
        ]}
      </Menu>
    </>
  );
};

export default PostCard;

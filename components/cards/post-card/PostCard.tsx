import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { Post, User, UserResponse } from '@/types/types';
import { getUserRole } from '@/utils/role';
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
            <Link href={`/p/@${post.createdBy?.username}`} passHref>
              <MuiLink>
                <Avatar
                  alt={
                    post.createdBy
                      ? `${post.createdBy?.username}'s profile image`
                      : undefined
                  }
                  src={
                    post.createdBy?.profileImage
                      ? post.createdBy.profileImage.url
                      : undefined
                  }
                >
                  {post.createdBy &&
                  post.createdBy.firstName &&
                  post.createdBy.lastName
                    ? post.createdBy.firstName?.charAt(0) +
                      post.createdBy.lastName?.charAt(0)
                    : post.createdBy.username?.charAt(0)}
                </Avatar>
              </MuiLink>
            </Link>
          }
          action={
            (user && getRole(user) === Roles.TEACHER) ||
            (user && getRole(user) === Roles.TA) ||
            (user && user.id === post.createdBy?.id && (
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
            ))
          }
          title={
            <Link href={`/p/@${post.createdBy?.username}`} passHref>
              <MuiLink underline="hover">
                <Typography noWrap variant="subtitle2">
                  {post.createdBy &&
                    post.createdBy.firstName + ' ' + post.createdBy.lastName}
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
              <Link href={`/p/@${post.createdBy?.username}`} passHref>
                <MuiLink underline="hover">
                  <Typography noWrap variant="caption" color="textSecondary">
                    @{post.createdBy?.username}
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
        {user && user.id === post.createdBy?.id && (
          <MenuItem onClick={() => alert('แก้ไข')} disableRipple>
            <EditIcon sx={{ mr: 1 }} />
            แก้ไข
          </MenuItem>
        )}
        {(user && getRole(user) === Roles.TEACHER) ||
          (user && getRole(user) === Roles.TA && (
            <MenuItem
              onClick={() => alert('ปักหมุด')}
              disableRipple
              disabled={classroom?.enabledInviteCode !== true}
            >
              <PushPinIcon sx={{ mr: 1 }} />
              ปักหมุด
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default PostCard;

import PostContent from '@/components/contents/post/PostContent';
import EditPostDialog from '@/components/dialogs/edit-post/EditPostDialog';
import PostCommentsSection from '@/components/sections/post-comments/PostCommentsSection';
import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { Post, User, UserResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import { deletePost, setPinPost } from '@/utils/PostService';
import { getUserRole } from '@/utils/role';
import { getUserFullName } from '@/utils/UserService';
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
  Chip,
  Divider,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, SxProps, useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const theme = useTheme();

  const [openEditPost, setOpenEditPostDialog] = useState(false);

  const { data: user } = useUser();
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });

  const queryClient = useQueryClient();
  const pinMutation = useMutation(
    (state: boolean) =>
      setPinPost(
        classroom?.id.toString() as string,
        post.id.toString() as string,
        state
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'posts',
          { classroomId: classroom?.id },
        ]);
        alert('แก้ไขการปักหมุดโพสต์สำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการแก้ไขการปักหมุด');
      },
    }
  );

  const deleteMutation = useMutation(
    () =>
      deletePost(
        classroom?.id.toString() as string,
        post.id.toString() as string
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'posts',
          { classroomId: classroom?.id },
        ]);
        alert('ลบโพสต์สำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบโพสต์');
      },
    }
  );

  const handleDeletePost = () => {
    if (confirm('ต้องการลบโพสต์นี้หรือไม่?')) {
      deleteMutation.mutate();
    }
  };

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

  const renderRoleChip = (role: Roles) => {
    if (role !== Roles.TEACHER && role !== Roles.TA) {
      return null;
    }

    const sx: SxProps = {
      height: 'auto',
      borderRadius: 1,
      '& .MuiChip-label': { px: 0.5 },
    };

    if (role === Roles.TEACHER) {
      sx.bgcolor = alpha(theme.palette.secondary.main, 0.1);
      sx.color = theme.palette.secondary.main;
    } else if (role === Roles.TA) {
      sx.bgcolor = alpha(theme.palette.info.main, 0.1);
      sx.color = theme.palette.info.main;
    }

    return <Chip label={role} size="small" sx={sx} />;
  };

  const isOwnPost = user && user.id === post.createBy.id;

  const isTeacherTA = Boolean(
    user &&
      ((user && getRole(user) === Roles.TEACHER) ||
        (user && getRole(user) === Roles.TA))
  );

  return (
    <>
      <EditPostDialog
        openDialog={openEditPost}
        setOpenDialog={setOpenEditPostDialog}
        post={post}
      />

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
              <MuiLink underline="none">
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
            (isOwnPost || isTeacherTA) && (
              <Tooltip title="ตัวเลือก">
                <IconButton
                  aria-label="more"
                  aria-controls={`post-menu-${post.id}`}
                  aria-haspopup="true"
                  onClick={handleMoreButtonClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )
          }
          title={
            <>
              <Link href={`/p/@${post.createBy?.username}`} passHref>
                <MuiLink underline="hover">
                  <Typography
                    noWrap
                    variant="subtitle2"
                    component="span"
                    sx={{ mr: 0.5 }}
                  >
                    {post.createBy && getUserFullName(post.createBy)}
                  </Typography>
                </MuiLink>
              </Link>
              {renderRoleChip(getRole(post.createBy) as Roles)}
            </>
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
        <CardContent sx={{ pt: 0 }}>
          <PostContent content={post.content} viewMoreButton={!compact} />
        </CardContent>
        <Divider />

        {!compact ? (
          <CardActions
            sx={{
              px: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <PostCommentsSection
              post={post}
              classroomSlug={classroomSlug ?? ''}
            />
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
        id={`post-menu-${post.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': `post-menu-${post.id}`,
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
        {isOwnPost && (
          <MenuItem
            key="post-menu-edit"
            onClick={() => setOpenEditPostDialog(true)}
            dense
            disableRipple
          >
            <EditIcon fontSize="inherit" sx={{ mr: 1 }} />
            แก้ไข
          </MenuItem>
        )}
        {isTeacherTA && [
          post.isPinned ? (
            <MenuItem
              key="post-menu-unpin"
              onClick={() => pinMutation.mutate(false)}
              dense
              disableRipple
            >
              <PushPinIcon fontSize="inherit" sx={{ mr: 1 }} />
              ยกเลิกปักหมุด
            </MenuItem>
          ) : (
            <MenuItem
              key="post-menu-pin"
              onClick={() => pinMutation.mutate(true)}
              dense
              disableRipple
            >
              <PushPinIcon fontSize="inherit" sx={{ mr: 1 }} />
              ปักหมุด
            </MenuItem>
          ),
        ]}
        {(isTeacherTA || isOwnPost) && [
          <Divider key="post-menu-divider" />,
          <MenuItem
            key="post-menu-delete"
            onClick={() => handleDeletePost()}
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

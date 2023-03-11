import PostContent from '@/components/contents/post/PostContent';
import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { User, UserComment, UserResponse } from '@/types/types';
import { editComment } from '@/utils/CommentService';
import { getImagePath } from '@/utils/imagePath';
import { getUserRole } from '@/utils/role';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, SxProps, useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  compareAsc,
  compareDesc,
  format,
  formatDistanceToNow,
  isAfter,
  parseISO,
} from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useRef, useState } from 'react';

export interface ICommentListItem {
  commentatorIsPostAuthor: boolean;
  userIsPostAuthor: boolean;
  comment: UserComment;
  // eslint-disable-next-line no-unused-vars
  handleDeleteComment: (id: string) => void;
}

const CommentListItem: React.FC<ICommentListItem> = ({
  commentatorIsPostAuthor = false,
  userIsPostAuthor = false,
  comment,
  handleDeleteComment,
}) => {
  const theme = useTheme();
  const { data: user } = useUser();
  const router = useRouter();
  const classroomSlug = router.query.slug as string;
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const [content, setContent] = useState<string>(comment.content);
  const [editing, setEditing] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const queryClient = useQueryClient();
  const editMutation = useMutation(
    (params: { id: string; content: string }) =>
      editComment(params.id, params.content),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['assignment-comments']);
        queryClient.invalidateQueries(['material-comments']);
        setEditing(false);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการแก้ไขความคิดเห็น');
      },
    }
  );

  const handleEditComment = () => {
    editMutation.mutate({
      id: comment.id.toString() as string,
      content: content,
    });
  };

  const getUserName = (user: UserResponse) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    return user.username;
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleEditCommentButtonClick = () => {
    setEditing(true);
    handleCloseMenu();
  };

  const handleDeleteCommentButtonClick = () => {
    handleDeleteComment(comment.id.toString());
    handleCloseMenu();
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

  const isTeacherOrTA =
    (user && getRole(user) === Roles.TEACHER) ||
    (user && getRole(user) === Roles.TA);

  const isOwnComment = user && user.id === comment.createBy.id;

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          '&:hover': {
            '& .MuiIconButton-root': {
              visibility: 'visible',
            },
          },
        }}
      >
        {/* Author Avatar */}
        <ListItemIcon sx={{ minWidth: 0, mr: 1, alignSelf: 'flex-start' }}>
          {comment && (
            <Link href={`/p/@${comment.createBy.username}`} passHref>
              <MuiLink underline="none">
                <Avatar
                  alt={
                    comment.createBy
                      ? `${comment.createBy?.username}'s profile image`
                      : undefined
                  }
                  src={getImagePath(comment.createBy.profileImage)}
                  sx={{ width: 36, height: 36 }}
                >
                  {comment.createBy &&
                  comment.createBy.firstName &&
                  comment.createBy.lastName
                    ? comment.createBy.firstName?.charAt(0) +
                      comment.createBy.lastName?.charAt(0)
                    : comment.createBy.username?.charAt(0)}
                </Avatar>
              </MuiLink>
            </Link>
          )}
        </ListItemIcon>

        <Card
          variant="outlined"
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: '20px',
            borderColor: theme.palette.divider,
            borderWidth: 1,
            borderStyle: 'solid',
            px: 2,
            alignSelf: 'flex-start',
            overflow: 'hidden',
            '& .MuiTypography-root': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            boxShadow: editing
              ? `0 0 0 1px ${alpha(theme.palette.info.main, 0.25)}`
              : 'none',
          }}
        >
          {/* Author Name */}
          <CardHeader
            title={
              <>
                <Link href={`/p/@${comment.createBy.username}`} passHref>
                  <MuiLink underline="hover">
                    <Typography
                      variant="subtitle2"
                      component="span"
                      noWrap
                      sx={{
                        fontWeight: 'bold',
                        mr: 0.5,
                      }}
                    >
                      {getUserName(comment.createBy)}
                    </Typography>
                  </MuiLink>
                </Link>

                {/* Post Author Badge */}
                {commentatorIsPostAuthor && (
                  <Chip
                    label="ผู้เขียน"
                    size="small"
                    sx={{
                      bgcolor: (theme) =>
                        alpha(theme.palette.success.main, 0.1),
                      color: (theme) => theme.palette.success.main,
                      height: 'auto',
                      borderRadius: 1,
                      mr: 0.5,
                      '& .MuiChip-label': { px: 0.5 },
                    }}
                  />
                )}

                {/* Post Author Badge */}
                {renderRoleChip(getRole(comment.createBy) as Roles)}
              </>
            }
            sx={{
              p: 0,
              display: 'flex',
              overflow: 'hidden',
              '& .MuiCardHeader-content': {
                overflow: 'hidden',
              },
              flexDirection: 'row',
              alignItems: 'center',
            }}
          />

          {/* Content */}
          <CardContent sx={{ p: 0, mt: 0.5 }}>
            {comment && (
              <>
                {editing ? (
                  <TextField
                    fullWidth
                    multiline
                    value={content}
                    inputRef={inputRef}
                    helperText={
                      <>
                        <Typography
                          variant="caption"
                          component="div"
                          color="textSecondary"
                        >
                          กด <kbd>Enter</kbd> เพื่อบันทึก
                        </Typography>
                        <Typography
                          variant="caption"
                          component="div"
                          color="textSecondary"
                        >
                          กด <kbd>Esc</kbd> เพื่อยกเลิก
                        </Typography>
                      </>
                    }
                    onFocus={(e) =>
                      e.currentTarget.setSelectionRange(
                        e.currentTarget.value.length,
                        e.currentTarget.value.length
                      )
                    }
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditing(false);
                        setContent(comment.content);
                      }

                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEditComment();
                      }
                    }}
                    sx={{
                      '& fieldset': { border: 'none' },
                    }}
                  />
                ) : (
                  <PostContent content={comment.content} viewMoreButton />
                )}
              </>
            )}
          </CardContent>

          {/* Post Date */}
          <CardActions
            sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}
          >
            <Tooltip
              arrow
              title={format(parseISO(comment.updatedAt), 'PPPPp', {
                locale: th,
              })}
            >
              <Typography
                component="span"
                variant="caption"
                color="textSecondary"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {isAfter(
                  parseISO(comment.updatedAt),
                  parseISO(comment.createdAt)
                )
                  ? 'แก้ไขล่าสุดเมื่อ '
                  : ''}
                {formatDistanceToNow(parseISO(comment.updatedAt), {
                  locale: th,
                  addSuffix: true,
                })}
              </Typography>
            </Tooltip>
          </CardActions>
        </Card>

        {/* More Button */}
        {(isTeacherOrTA || isOwnComment || userIsPostAuthor) && (
          <Box
            sx={{
              display: 'flex',
              alignSelf: 'center',
              visibility: 'hidden',
              ml: 1,
            }}
          >
            <IconButton onClick={handleMoreButtonClick}>
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </ListItem>

      {/* Comment Menu */}
      <Menu
        id="comment-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'comment-menu',
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
        {isOwnComment && (
          <MenuItem
            key="comment-menu-edit"
            onClick={handleEditCommentButtonClick}
            dense
            disableRipple
          >
            <EditIcon fontSize="inherit" sx={{ mr: 1 }} />
            แก้ไข
          </MenuItem>
        )}
        {(isTeacherOrTA || isOwnComment || userIsPostAuthor) && [
          <MenuItem
            key="comment-menu-delete"
            onClick={handleDeleteCommentButtonClick}
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

export interface ICommentList {
  postAuthorId?: number;
  comments: UserComment[];
  previewSize?: number;
  sort?: 'newest' | 'oldest';
  // eslint-disable-next-line no-unused-vars
  handleDeleteComment: (id: string) => void;
}

const CommentList: React.FC<ICommentList> = ({
  postAuthorId,
  comments,
  previewSize = 10,
  sort = 'newest',
  handleDeleteComment,
}) => {
  const { data: user } = useUser();
  const [currentSize, setCurrentSize] = useState<number>(previewSize || 0);
  const [parent] = useAutoAnimate();

  return (
    <List
      ref={parent}
      sx={{
        width: '100%',
      }}
    >
      {comments
        .sort((a, b) => {
          if (sort === 'newest') {
            return compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
          }

          return compareAsc(parseISO(a.createdAt), parseISO(b.createdAt));
        })
        .filter((_, idx) => (currentSize ? idx < currentSize : true))
        .map((comment) => (
          <CommentListItem
            key={comment.id}
            comment={comment}
            commentatorIsPostAuthor={postAuthorId === comment.createBy.id}
            userIsPostAuthor={postAuthorId === user?.id}
            handleDeleteComment={handleDeleteComment}
          />
        ))}
      {previewSize && currentSize < comments.length && (
        <ListItem
          disableGutters
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            mt: 1,
          }}
        >
          <Button
            variant="text"
            size="small"
            disableRipple
            onClick={() => setCurrentSize(currentSize + previewSize)}
            sx={{
              '&.MuiButtonBase-root:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            ดูความคิดเห็นเพิ่มเติม
          </Button>
        </ListItem>
      )}
      {previewSize &&
        previewSize < comments.length &&
        currentSize >= comments.length && (
          <ListItem
            disableGutters
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              mt: 1,
            }}
          >
            <Button
              variant="text"
              size="small"
              disableRipple
              onClick={() => setCurrentSize(previewSize)}
              sx={{
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              แสดงน้อยลง
            </Button>
          </ListItem>
        )}
    </List>
  );
};

export default CommentList;

import PostContent from '@/components/contents/post/PostContent';
import { UserComment, UserResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Typography,
} from '@mui/material';
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
import { useState } from 'react';

export interface ICommentListItem {
  comment: UserComment;
  handleOpenMenu: (id: number) => void;
}

const CommentListItem: React.FC<ICommentListItem> = ({
  comment,
  handleOpenMenu,
}) => {
  const getUserName = (user: UserResponse) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    return user.username;
  };

  return (
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
          '& .MuiCard-root': {
            borderTopLeftRadius: '6px',
            borderBottomLeftRadius: '40px',
            borderTopRightRadius: '40px',
            transition: 'all 0.2s ease-in-out',
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
          bgcolor: (theme) => theme.palette.background.default,
          borderRadius: '20px',
          borderColor: (theme) => theme.palette.divider,
          borderWidth: 1,
          borderStyle: 'solid',
          px: 2,
          alignSelf: 'flex-start',
          overflow: 'hidden',
          '& .MuiTypography-root': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        {/* Author Name */}
        <CardHeader
          title={
            <Link href={`/p/@${comment.createBy.username}`} passHref>
              <MuiLink underline="hover">
                <Typography
                  variant="subtitle2"
                  component="span"
                  noWrap
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {getUserName(comment.createBy)}
                </Typography>
              </MuiLink>
            </Link>
          }
          sx={{
            p: 0,
            display: 'flex',
            overflow: 'hidden',
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            },
          }}
        />

        {/* Content */}
        <CardContent sx={{ p: 0, mt: 0.5 }}>
          {comment && (
            <>
              <PostContent content={comment.content} viewMoreButton />
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
              {isAfter(parseISO(comment.updatedAt), parseISO(comment.createdAt))
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
      <Box
        sx={{
          display: 'flex',
          alignSelf: 'center',
          visibility: 'hidden',
          ml: 1,
        }}
      >
        <IconButton onClick={() => handleOpenMenu(comment.id)}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export interface ICommentList {
  comments: UserComment[];
  previewSize?: number;
  sort?: 'newest' | 'oldest';
  handleOpenMenu: (id: number) => void;
}

const CommentList: React.FC<ICommentList> = ({
  comments,
  previewSize = 10,
  sort = 'newest',
  handleOpenMenu,
}) => {
  const [currentSize, setCurrentSize] = useState<number>(previewSize || 0);

  return (
    <List
      sx={{
        width: '100%',
      }}
    >
      {comments
        .filter((_, idx) => (currentSize ? idx < currentSize : true))
        .sort((a, b) => {
          if (sort === 'newest') {
            return compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt));
          }

          return compareAsc(parseISO(a.updatedAt), parseISO(b.updatedAt));
        })
        .map((comment) => (
          <CommentListItem
            key={comment.id}
            comment={comment}
            handleOpenMenu={handleOpenMenu}
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

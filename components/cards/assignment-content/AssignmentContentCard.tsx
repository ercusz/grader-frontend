import MarkdownPreview from '@/components/previews/markdown/MarkdownPreview';
import { Assignment, UserResponse } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import AlarmIcon from '@mui/icons-material/Alarm';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Card,
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
  useTheme,
} from '@mui/material';
import { format, formatDistanceToNow, isAfter, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';

export interface IAssignmentContentCard {
  assignment: Assignment;
}

export interface IAuthorDetail {
  author: UserResponse;
  date: Date;
}

const AuthorDetails: React.FC<IAuthorDetail> = ({ author, date }) => {
  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="caption">
        {`อัปเดตล่าสุดเมื่อ ${format(date, 'PPPPp', {
          locale: th,
        })}`}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Avatar
          alt={
            author.username ? `${author.username}'s profile image` : undefined
          }
          src={getImagePath(author.profileImage)}
        >
          {author.firstName && author.lastName
            ? author.firstName?.charAt(0) + author.lastName?.charAt(0)
            : author.username?.charAt(0)}
        </Avatar>
        <Stack direction="column">
          <Typography className="font-bold" variant="body2">
            {author.firstName + ' ' + author.lastName}
          </Typography>
          <Link href={`/p/@${author.username}`} passHref>
            <MuiLink sx={{ p: 0, m: 0 }}>
              <Typography variant="caption">@{author.username}</Typography>
            </MuiLink>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};

const AssignmentContentCard: React.FC<IAssignmentContentCard> = ({
  assignment,
}) => {
  const theme = useTheme();

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
        className="shadow-xl w-full"
        variant="outlined"
        sx={{ px: 2, py: 4, mb: 4 }}
      >
        <CardHeader
          sx={{ py: 0 }}
          title={
            <Stack direction="row" spacing={2}>
              {isAfter(parseISO(assignment.startDate), new Date()) && (
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
              )}
              <Tooltip
                title={formatDistanceToNow(parseISO(assignment.endDate), {
                  locale: th,
                  addSuffix: true,
                })}
              >
                <Chip
                  size="small"
                  color="info"
                  icon={<AlarmIcon />}
                  label={
                    <Typography variant="caption">{`กำหนดส่ง ${format(
                      parseISO(assignment.endDate),
                      'PPp',
                      {
                        locale: th,
                      }
                    )}`}</Typography>
                  }
                  variant="outlined"
                />
              </Tooltip>
            </Stack>
          }
          action={
            <IconButton
              aria-controls={open ? 'invite-code-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleMoreButtonClick}
              aria-label="more"
            >
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent className="w-full">
          <Box sx={{ my: 4 }}>
            <Typography
              className="font-extrabold text-center"
              component="h1"
              variant="h4"
              gutterBottom
            >
              {assignment.title}
            </Typography>
            {assignment.updateBy && assignment.updatedAt ? (
              <AuthorDetails
                author={assignment.updateBy}
                date={parseISO(assignment.updatedAt)}
              />
            ) : (
              <AuthorDetails
                author={assignment.createBy}
                date={parseISO(assignment.createdAt)}
              />
            )}
            <Divider sx={{ my: 6 }} />
          </Box>

          <div data-color-mode={theme.palette.mode}>
            <MarkdownPreview content={assignment.content} />
          </div>
        </CardContent>
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
        <MenuItem onClick={() => handleCloseMenu()} disableRipple>
          <EditIcon sx={{ mr: 1 }} />
          แก้ไขโพสต์
        </MenuItem>
      </Menu>
    </>
  );
};

export default AssignmentContentCard;

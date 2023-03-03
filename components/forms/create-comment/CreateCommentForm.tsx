import { useUser } from '@/hooks/user/useUser';
import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  IconButton,
  Link as MuiLink,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useState } from 'react';

export interface ICreateCommentForm {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (content: string) => void;
}

const CreateCommentForm: React.FC<ICreateCommentForm> = ({ onSubmit }) => {
  const theme = useTheme();
  const { data: user } = useUser();
  const [comment, setComment] = useState<string>('');

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        width: '100%',
      }}
    >
      <Link href={`/p/@${user?.username}`} passHref>
        <MuiLink underline="none">
          <Avatar
            alt={user ? `${user?.username}'s profile image` : undefined}
            src={user?.profileImage ? user.profileImage.url : undefined}
            sx={{ width: 36, height: 36 }}
          >
            {user && user.firstName && user.lastName
              ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
              : user?.username?.charAt(0)}
          </Avatar>
        </MuiLink>
      </Link>
      <TextField
        size="small"
        placeholder="เขียนความคิดเห็น…"
        multiline
        minRows={1}
        fullWidth
        onChange={(e) => setComment(e.target.value)}
        InputProps={{
          endAdornment: (
            <Tooltip title="แสดงความคิดเห็น" arrow>
              <div style={{ cursor: 'not-allowed' }}>
                <IconButton
                  onClick={() => onSubmit(comment)}
                  disabled={comment.length === 0}
                  sx={{
                    p: 0,
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </div>
            </Tooltip>
          ),
          sx: {
            alignItems: 'flex-end',
          },
        }}
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: '20px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.divider,
              borderRadius: '20px',
            },
            '&:hover fieldset, &.Mui-focused fieldset': {
              borderColor: theme.palette.divider,
              borderWidth: 1,
            },
            '&.Mui-focused fieldset': {
              boxShadow: `0 0 0 1px ${alpha(theme.palette.info.main, 0.25)}`,
            },
          },
        }}
      />
    </Stack>
  );
};

export default CreateCommentForm;

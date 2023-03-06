import { useUser } from '@/hooks/user/useUser';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import CheckIcon from '@mui/icons-material/Check';
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
import { useEffect, useState } from 'react';

export interface ICreateCommentForm {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (content: string, onSuccessCallback?: () => void) => void;
}

const CreateCommentForm: React.FC<ICreateCommentForm> = ({ onSubmit }) => {
  const theme = useTheme();
  const { data: user } = useUser();
  const [comment, setComment] = useState<string>('');
  const [parent] = useAutoAnimate();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showSuccess]);

  const onSuccess = () => {
    setComment('');
    setShowSuccess(true);
  };

  const handleSubmit = () => {
    onSubmit(comment, onSuccess);
  };

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
        value={showSuccess ? 'ความคิดเห็นของคุณถูกส่งแล้ว🚀' : comment}
        onChange={(e) => setComment(e.target.value)}
        InputProps={{
          readOnly: showSuccess,
          endAdornment: (
            <div ref={parent}>
              {!showSuccess ? (
                <div style={{ cursor: 'not-allowed' }}>
                  <IconButton
                    onClick={handleSubmit}
                    disabled={comment.length === 0}
                    sx={{
                      p: 0,
                    }}
                  >
                    <Tooltip title="แสดงความคิดเห็น" arrow>
                      <SendIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                </div>
              ) : (
                <div>
                  <IconButton
                    disableRipple
                    sx={{
                      p: 0,
                    }}
                  >
                    <CheckIcon fontSize="small" color="success" />
                  </IconButton>
                </div>
              )}
            </div>
          ),
          sx: {
            color: showSuccess ? theme.palette.success.main : undefined,
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
              boxShadow: showSuccess
                ? `0 0 0 1px ${alpha(theme.palette.success.main, 0.25)}`
                : 'none',
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

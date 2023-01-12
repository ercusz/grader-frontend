import { useUser } from '@/hooks/user/useUser';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Alert,
  AlertTitle,
  Avatar,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

export interface ISubmissionStatusCard {}

const SubmissionStatusCard: React.FC<ISubmissionStatusCard> = () => {
  const { data: user } = useUser();

  const isSubmit = false;

  return (
    <Alert
      className="w-full shadow-xl"
      severity={isSubmit ? 'success' : 'error'}
      icon={false}
      sx={{
        borderRadius: '4px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderOpacity: 0.12,
        '& .MuiAlert-message': {
          textAlign: 'center',
          width: 'inherit',
        },
      }}
    >
      <Divider sx={{ mb: 2 }}>
        <AlertTitle className="text-sm tracking-widest">
          สถานะการส่งงาน
        </AlertTitle>
      </Divider>
      <Stack className="w-full" direction="column">
        <Chip
          className="mx-auto mb-4"
          size="small"
          label={`${user?.firstName} ${user?.lastName}`}
          avatar={
            <Avatar
              alt={user ? `${user?.username}'s profile image` : undefined}
              src={user?.profileImage ? user.profileImage.url : undefined}
            >
              {user && user.firstName && user.lastName
                ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
                : user?.username?.charAt(0)}
            </Avatar>
          }
        />
        <Stack
          direction="row"
          spacing={1}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography variant="h6">
            {isSubmit ? 'ส่งงานแล้ว' : 'ยังไม่ส่งงาน'}
          </Typography>
          {isSubmit ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
        </Stack>
      </Stack>
    </Alert>
  );
};

export default SubmissionStatusCard;

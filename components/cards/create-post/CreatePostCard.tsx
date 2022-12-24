import { useUser } from '@/hooks/user/useUser';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookIcon from '@mui/icons-material/Book';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';

export interface ICreatePostCard {}

const CreatePostCard: React.FC<ICreatePostCard> = () => {
  const { data: user } = useUser();

  return (
    <Card className="shadow-xl" variant="outlined" sx={{ width: '100%' }}>
      <CardContent className="pb-0" sx={{ width: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            alt={user ? `${user?.username}'s profile image` : undefined}
            src={user?.profileImage ? user.profileImage.url : undefined}
          >
            {user && user.firstName && user.lastName
              ? user.firstName?.charAt(0) + user.lastName?.charAt(0)
              : user?.username?.charAt(0)}
          </Avatar>
          <Button
            className="font-normal"
            variant="outlined"
            fullWidth
            disableElevation
            sx={{
              borderRadius: 20,
              justifyContent: 'flex-start',
            }}
          >
            เขียนอะไรสักหน่อย...
          </Button>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="text"
            fullWidth
            startIcon={<AssignmentIcon color="secondary" />}
          >
            เพิ่มงาน
          </Button>
          <Button
            variant="text"
            fullWidth
            startIcon={<BookIcon color="success" />}
          >
            เพิ่มเอกสาร
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;

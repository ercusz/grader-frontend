import { Roles } from '@/constants/roles';
import { useUser } from '@/hooks/user/useUser';
import { openCreateAssignmentDialogAtom } from '@/stores/create-assignment';
import { openCreateMaterialDialogAtom } from '@/stores/create-material';
import { openCreatePostDialogAtom } from '@/stores/create-post';
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
import { useAtom } from 'jotai';

export interface ICreatePostCard {
  userRole: Roles;
}

const CreatePostCard: React.FC<ICreatePostCard> = ({ userRole }) => {
  const [, setOpenCreatePostDialog] = useAtom(openCreatePostDialogAtom);
  const [, setOpenCreateAssignmentDialog] = useAtom(
    openCreateAssignmentDialogAtom
  );
  const [, setOpenCreateMaterialDialog] = useAtom(openCreateMaterialDialogAtom);
  const { data: user } = useUser();

  return (
    <Card className="shadow-xl" variant="outlined" sx={{ width: '100%' }}>
      <CardContent className="pb-0" sx={{ width: '100%' }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            mb: userRole === Roles.TEACHER || userRole === Roles.TA ? 0 : 2,
          }}
        >
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
            onClick={() => setOpenCreatePostDialog(true)}
          >
            เขียนอะไรสักหน่อย...
          </Button>
        </Stack>
        {(userRole === Roles.TEACHER || userRole === Roles.TA) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Button
                variant="text"
                fullWidth
                startIcon={<AssignmentIcon color="secondary" />}
                onClick={() => setOpenCreateAssignmentDialog(true)}
              >
                เพิ่มงาน
              </Button>
              <Button
                variant="text"
                fullWidth
                startIcon={<BookIcon color="success" />}
                onClick={() => setOpenCreateMaterialDialog(true)}
              >
                เพิ่มเอกสาร
              </Button>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;

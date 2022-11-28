import InviteCodeCard from '@/components/cards/invite-code/InviteCodeCard';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { UserResponse } from '@/types/types';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ClassroomTabs from '../../tabs/classroom-tabs/ClassroomTabs';

export interface IClassroomMenu {
  classroomSlug: string;
}

const ClassroomMenu: React.FC<IClassroomMenu> = ({ classroomSlug }) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const { data: user } = useUser();

  const getStudentName = (student: UserResponse) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return student.username;
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={2}
        sx={{
          mb: 3,
        }}
      >
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
          >
            {classroom?.enabledInviteCode === true ? (
              <Chip
                icon={<PublicIcon />}
                label="อนุญาตการเข้าร่วม"
                color="success"
                size="small"
              />
            ) : (
              <Chip
                icon={<LockIcon />}
                label="ปฏิเสธการเข้าร่วม"
                color="error"
                size="small"
              />
            )}
            <Stack direction="row" alignItems="center" spacing={1}>
              <PeopleIcon />
              <Typography
                className="font-bold"
                variant="body2"
                color="text.secondary"
              >
                {`ผู้เรียน ${classroom?.students.length} คน`}
              </Typography>
            </Stack>
          </Stack>
          <AvatarGroup
            max={10}
            sx={{
              display: 'flex',
              justifyContent: 'start',
              mt: 2,
              '& .MuiAvatar-root': {
                width: { xs: 32, md: 42 },
                height: { xs: 32, md: 42 },
                fontSize: { xs: 15, md: 24 },
              },
            }}
          >
            {classroom?.students.map((student) => (
              <Tooltip key={student.username} title={getStudentName(student)}>
                <Avatar
                  className="shadow-md"
                  alt={getStudentName(student)}
                  src={`${process.env.NEXT_PUBLIC_STRAPI_HOST}${student.profileImage?.url}`}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>
        {user?.role.name === 'Teacher' && (
          <Box>
            <InviteCodeCard classroomSlug={classroomSlug} />
          </Box>
        )}
      </Stack>
      <Divider />
      <ClassroomTabs />
      <Divider />
    </Box>
  );
};

export default ClassroomMenu;

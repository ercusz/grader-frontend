import InviteCodeCard from '@/components/cards/invite-code/InviteCodeCard';
import { Roles } from '@/constants/roles';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { User, UserResponse } from '@/types/types';
import { leaveClassroom } from '@/utils/ClassroomService';
import { getImagePath } from '@/utils/imagePath';
import { getUserRole } from '@/utils/role';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { MouseEvent, useMemo, useState } from 'react';
import ClassroomTabs from '../../tabs/classroom-tabs/ClassroomTabs';

export interface IClassroomMenu {
  classroomSlug: string;
}

const ClassroomMenu: React.FC<IClassroomMenu> = ({ classroomSlug }) => {
  const router = useRouter();

  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const { data: user } = useUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const teacherCount = useMemo(
    () => classroom?.course.teachers.length || 0,
    [classroom?.course.teachers]
  );

  const taCount = useMemo(
    () => classroom?.teacherAssistants.length || 0,
    [classroom?.teacherAssistants]
  );

  const studentCount = useMemo(
    () => classroom?.students.length || 0,
    [classroom?.students]
  );

  const totalMemberCount = useMemo(
    () => teacherCount + taCount + studentCount,
    [teacherCount, taCount, studentCount]
  );

  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    () => leaveClassroom(classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroomSlug }]);
        alert('ออกจากคลาสเรียนสำเร็จ');
        router.push('/classroom');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการออกจากคลาสเรียน');
      },
    }
  );

  const handleLeaveClassroom = () => {
    if (confirm('คุณต้องการออกจากคลาสเรียนนี้ใช่หรือไม่')) {
      deleteMutation.mutate();
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAvatarClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const getMemberName = (student: UserResponse | User) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }

    return student.username;
  };

  const getRole = (targetUser: UserResponse | User) => {
    return getUserRole({
      teachers: classroom?.course.teachers || ([] as UserResponse[]),
      teacherAssistants: classroom?.teacherAssistants || ([] as UserResponse[]),
      students: classroom?.students || ([] as UserResponse[]),
      targetUser: targetUser,
    });
  };

  const isTaStudent =
    user && (getRole(user) === Roles.TA || getRole(user) === Roles.STUDENT);

  return (
    <>
      {classroom && user && (
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
                {classroom.enabledInviteCode === true ? (
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
                <Tooltip
                  className="cursor-pointer"
                  title={
                    <>
                      {teacherCount > 0 && (
                        <Typography variant="body2">
                          ผู้สอน {teacherCount} คน
                        </Typography>
                      )}
                      {taCount > 0 && (
                        <Typography variant="body2">
                          ผู้ช่วยสอน {taCount} คน
                        </Typography>
                      )}
                      {studentCount > 0 && (
                        <Typography variant="body2">
                          ผู้เรียน {studentCount} คน
                        </Typography>
                      )}
                    </>
                  }
                  arrow
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PeopleIcon />
                    <Typography
                      className="font-bold"
                      variant="body2"
                      color="text.secondary"
                    >
                      {`สมาชิก ${totalMemberCount} คน`}
                    </Typography>
                  </Stack>
                </Tooltip>
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
                  '& .MuiButtonBase-root': {
                    width: { xs: 32, md: 42 },
                    height: { xs: 32, md: 42 },
                    fontSize: { xs: 15, md: 24 },
                  },
                  alignItems: 'center',
                }}
              >
                <Tooltip title={getMemberName(user) + '(คุณ)'}>
                  <IconButton onClick={handleAvatarClick}>
                    <Avatar
                      className="shadow-md"
                      alt={getMemberName(user)}
                      src={
                        user.profileImage
                          ? getImagePath(user.profileImage)
                          : undefined
                      }
                    />
                  </IconButton>
                </Tooltip>
                {[
                  ...classroom.course.teachers,
                  ...classroom.teacherAssistants,
                  ...classroom.students,
                ]
                  .filter((member) => member.id !== user?.id)
                  .map((member) => (
                    <Tooltip
                      key={member.username}
                      title={getMemberName(member)}
                    >
                      <Avatar
                        className="shadow-md"
                        alt={getMemberName(member)}
                        src={getImagePath(member.profileImage)}
                      />
                    </Tooltip>
                  ))}
              </AvatarGroup>
            </Box>
            {user &&
              (getRole(user) === Roles.TEACHER ||
                getRole(user) === Roles.TA) && (
                <Box>
                  <InviteCodeCard classroomSlug={classroomSlug} />
                </Box>
              )}
          </Stack>
          <Divider />
          <ClassroomTabs />
          <Divider />
        </Box>
      )}

      {user && (
        <Menu
          id="user-avatar-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'user-avatar-menu',
          }}
          elevation={12}
        >
          <MenuItem
            dense
            disableRipple
            sx={{
              justifyContent: 'center',
              pointerEvents: 'none',
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 0.72),
            }}
          >
            <Box>
              <Stack
                className="w-full flex pt-1 pb-4"
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <Avatar
                  className="shadow-md"
                  alt={getMemberName(user)}
                  src={
                    user.profileImage
                      ? getImagePath(user.profileImage)
                      : undefined
                  }
                />
                <Typography variant="body2">{getMemberName(user)}</Typography>
                <Chip label={getRole(user)} size="small" />
              </Stack>
            </Box>
          </MenuItem>
          {isTaStudent && (
            <Box>
              <Divider />
              <MenuItem
                dense
                disableRipple
                onClick={() => handleLeaveClassroom()}
              >
                <ExitToAppIcon
                  color="error"
                  fontSize="inherit"
                  sx={{ mr: 1 }}
                />
                <Typography color="error" variant="body2">
                  ออกจากคลาสเรียน
                </Typography>
              </MenuItem>
            </Box>
          )}
        </Menu>
      )}
    </>
  );
};

export default ClassroomMenu;

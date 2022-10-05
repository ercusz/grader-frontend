import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import ClassroomTabs from '../../tabs/classroom-tabs/ClassroomTabs';

export interface IClassroomMenu {}

const ClassroomMenu: React.FC<IClassroomMenu> = () => {
  const [random] = useState(Math.random());
  
  return (
    <Box sx={{ pb: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Chip
          icon={<PublicIcon />}
          label="อนุญาตการเข้าร่วม"
          color="success"
          size="small"
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <PeopleIcon />
          <Typography
            className="font-bold"
            variant="body2"
            color="text.secondary"
          >
            {`ผู้เรียน ${15} คน`}
          </Typography>
        </Stack>
      </Stack>
      <AvatarGroup
        max={10}
        sx={{
          display: 'flex',
          justifyContent: 'start',
          mt: 2,
          mb: 3,
          '& .MuiAvatar-root': {
            width: { xs: 32, md: 42 },
            height: { xs: 32, md: 42 },
            fontSize: { xs: 15, md: 24 },
          },
        }}
      >
        {[...Array(15)].map((_, idx) => (
          <Avatar
            key={idx}
            alt={String.fromCharCode(
              0 | (random * 26 + 97)
            ).toUpperCase()}
            src={`/static/images/avatar/${idx}.jpg`}
          />
        ))}
      </AvatarGroup>
      <Divider />
      <ClassroomTabs />
      <Divider />
    </Box>
  );
};

export default ClassroomMenu;

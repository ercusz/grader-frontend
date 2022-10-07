import { Section } from '@/types/types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import React from 'react';

export interface ICourseClassroomCard {
  courseName: string;
  classroom: Section;
}

const CourseClassroomCard: React.FC<ICourseClassroomCard> = ({
  courseName,
  classroom,
}) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          noWrap
          gutterBottom
        >
          {courseName}
        </Typography>
        <Typography className="font-bold" variant="h5" component="div" noWrap>
          {classroom.name}
        </Typography>
        {/* <Stack
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
          <Typography
            className="font-bold"
            variant="caption"
            color="text.secondary"
          >
            {`ผู้เรียน ${999} คน`}
          </Typography>
        </Stack>
        <AvatarGroup
          max={4}
          sx={{
            display: 'flex',
            justifyContent: 'start',
            mt: 1,
            mb: 2,
            '& .MuiAvatar-root': {
              width: 24,
              height: 24,
              fontSize: 15,
            },
          }}
        >
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 32, height: 32 }}>
              <AssignmentIcon fontSize="inherit" />
            </Avatar>
            <Typography variant="body2">{`${22} ภาระงาน`}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 32, height: 32 }}>
              <BookIcon fontSize="inherit" />
            </Avatar>
            <Typography variant="body2">{`${40} เอกสาร`}</Typography>
          </Stack>
        </Stack> */}
      </CardContent>
      <CardActions>
        <Button size="small">เรียกดู</Button>
      </CardActions>
    </Card>
  );
};

export default CourseClassroomCard;

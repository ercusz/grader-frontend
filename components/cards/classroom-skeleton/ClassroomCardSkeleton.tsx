import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React from 'react';

export interface IClassroomCardSkeleton {}

const ClassroomCardSkeleton: React.FC = () => {
  return (
    <>
      <Card
        sx={[
          {
            height: '100%',
            flexDirection: 'column',
            outlineColor: (theme) => alpha(theme.palette.primary.main, 0.3),
            WebkitBoxReflect:
              'below 1px linear-gradient(transparent, rgba(0, 0, 0, .2))',
          },
          (theme) => ({
            '&:hover': {
              outlineColor: alpha(theme.palette.primary.main, 1),
            },
          }),
        ]}
      >
        <CardHeader
          title={
            <>
              <Skeleton animation="wave" width={75} height={28} />
              <Typography variant="h6">
                <Skeleton animation="wave" />
              </Typography>
            </>
          }
          subheader={<Skeleton animation="wave" width={75} height={28} />}
          action={
            <Skeleton
              animation="wave"
              variant="circular"
              width={55}
              height={55}
            />
          }
          sx={{
            display: 'flex',
            overflow: 'hidden',
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            },
          }}
        />
        <CardMedia className="relative h-[136px]">
          <Skeleton animation="wave" variant="rectangular" width="100%">
            <div style={{ paddingTop: '57%' }} />
          </Skeleton>
        </CardMedia>
        <CardActions
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          className="overflow-hidden relative mx-auto flex items-center gap-6"
        >
          <Skeleton
            className="absolute w-20 h-20 -left-5 rounded-full shadow-lg"
            animation="wave"
            variant="circular"
          />
          <Container className="flex flex-col pl-16">
            <Typography variant="body2">
              <Skeleton animation="wave" />
            </Typography>
            <Typography variant="caption">
              <Skeleton animation="wave" />
            </Typography>
          </Container>
        </CardActions>
      </Card>
    </>
  );
};

export default ClassroomCardSkeleton;

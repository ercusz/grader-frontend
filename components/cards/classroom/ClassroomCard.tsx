import { MyClassroom } from '@/types/types';
import { getImagePath } from '@/utils/imagePath';
import CheckIcon from '@mui/icons-material/Check';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  CircularProgressProps,
  Container,
  Fab,
  Link as MuiLink,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ClassroomCardSkeleton from '../classroom-skeleton/ClassroomCardSkeleton';

const CircularProgressWithLabel = (
  props: CircularProgressProps & { value: number }
) => {
  return (
    <Tooltip
      title={props?.value === 100 ? 'ส่งงานครบ' : 'ความคืบหน้าในการส่งงาน'}
      placement="top"
      arrow
    >
      {props?.value === 100 ? (
        <Fab
          className="cursor-pointer"
          size="small"
          aria-label="ส่งงานครบ"
          color="success"
          sx={{
            marginTop: 1,
            marginRight: 1,
            boxShadow: 'none',
            cursor: 'context-menu',
          }}
        >
          <CheckIcon />
        </Fab>
      ) : (
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            marginTop: 1,
            marginRight: 1,
          }}
        >
          <CircularProgress
            variant="determinate"
            sx={{
              color: (theme) =>
                theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
            }}
            size={40}
            thickness={4}
            {...props}
            value={100}
          />
          <CircularProgress
            variant="determinate"
            sx={{
              color: (theme) => theme.palette.info.main,
              animationDuration: '550ms',
              position: 'absolute',
              left: 0,
            }}
            size={40}
            thickness={4}
            {...props}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >{`${Math.round(props.value)}%`}</Typography>
          </Box>
        </Box>
      )}
    </Tooltip>
  );
};

export interface IClassroomCard {
  classroom: MyClassroom;
  loading: boolean;
}

const ClassroomCard: React.FC<IClassroomCard> = ({ classroom, loading }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (percent < classroom.success) {
      setInterval(() => {
        setPercent((p) => {
          let newPercent = p + 10;
          if (newPercent > classroom.success) {
            return classroom.success;
          }

          return newPercent;
        });
      }, 500);
    }
  }, [classroom.success, percent]);

  return (
    <>
      {loading ? (
        <ClassroomCardSkeleton />
      ) : (
        classroom &&
        classroom.course && (
          <Card
            className="transition-all ease-in-out
            duration-200 cursor-pointer rounded-md
            outline outline-1 outline-offset-2
            hover:outline-2 hover:-translate-y-6"
            sx={[
              {
                height: '100%',
                flexDirection: 'column',
                outlineStyle: 'auto',
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
            <Link href={`/classroom/${classroom.slug}`} passHref>
              <MuiLink className="no-underline" variant="body2">
                <CardHeader
                  title={
                    <>
                      <Chip
                        className="font-bold cursor-pointer"
                        label={classroom.name}
                        color="primary"
                        size="small"
                      />
                      <Typography className="font-bold" noWrap variant="h6">
                        {classroom.course.name}
                      </Typography>
                    </>
                  }
                  subheader={
                    classroom.course.semester && classroom.course.year
                      ? `${classroom.course.semester}/${classroom.course.year}`
                      : '\xa0'
                  }
                  subheaderTypographyProps={{ noWrap: true }}
                  action={
                    <Box className="m-auto h-full">
                      <CircularProgressWithLabel value={percent} />
                    </Box>
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
                  <Image
                    className="w-full object-cover"
                    placeholder="blur"
                    blurDataURL={
                      'data:image/svg+xml;base64,LEHV6nWB2yk8pyo0adR*.7kCMdnj'
                    }
                    layout="fill"
                    quality={60}
                    alt={`${classroom.name} classroom cover image`}
                    src={getImagePath(classroom.course.coverImage)}
                    sizes="100vw"
                  />
                </CardMedia>
              </MuiLink>
            </Link>
            <CardActions
              sx={{ bgcolor: (theme) => theme.palette.background.paper }}
              className="overflow-hidden relative mx-auto flex items-center gap-6"
            >
              <Avatar className="absolute w-20 h-20 -left-5 rounded-full shadow-lg">
                {classroom.course.teachers[0].profileImage && (
                  <Image
                    className="object-cover"
                    layout="fill"
                    quality={60}
                    alt={`${classroom.course.teachers[0].firstName} ${classroom.course.teachers[0].lastName}`}
                    src={getImagePath(
                      classroom.course.teachers[0].profileImage
                    )}
                    sizes="100vw"
                  />
                )}
              </Avatar>
              <Container className="flex flex-col pl-16">
                <Link
                  className="no-underline hover:underline"
                  href={`/p/@${classroom.course.teachers[0].username}`}
                >
                  <Typography
                    variant="body2"
                    noWrap
                    className="font-semibold"
                  >{`${classroom.course.teachers[0].firstName} ${classroom.course.teachers[0].lastName}`}</Typography>
                </Link>
                <Link
                  className="no-underline hover:underline"
                  href={`/p/@${classroom.course.teachers[0].username}`}
                >
                  <Typography noWrap variant="caption">
                    @{classroom.course.teachers[0].username}
                  </Typography>
                </Link>
              </Container>
            </CardActions>
          </Card>
        )
      )}
    </>
  );
};

export default ClassroomCard;

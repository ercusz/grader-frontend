import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Container,
  Link,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ClassroomCardSkeleton from '../classroom-skeleton/ClassroomCardSkeleton';

export interface IClassroomTeacherCard {
  classroom: any;
  loading: boolean;
}

const ClassroomTeacherCard: React.FC<IClassroomTeacherCard> = ({
  classroom,
  loading,
}) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (percent < classroom.success) {
      setPercent((p) => {
        let newPercent = p + 20;
        if (newPercent > classroom.success) {
          return classroom.success;
        }

        return newPercent;
      });
    }
  }, [classroom.success, percent]);

  return (
    <>
      {loading ? (
        <ClassroomCardSkeleton />
      ) : (
        <Card
          className="transition-all ease-in-out
          duration-200 cursor-pointer
          outline outline-1 outline-offset-2
          hover:outline-2 hover:-translate-y-6"
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
          <Link className="no-underline" href={`/c/t/${classroom.slug}`}>
            <CardHeader
              title={
                <>
                  <Typography className="font-bold" noWrap variant="h6">
                    {classroom.name}
                  </Typography>
                </>
              }
              subheader={`${classroom.semester}/${classroom.year}`}
              subheaderTypographyProps={{ noWrap: true }}
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
                blurDataURL={`data:image/svg+xml;base64,LEHV6nWB2yk8pyo0adR*.7kCMdnj`}
                layout="fill"
                quality={60}
                alt={`${classroom.name} classroom cover image`}
                src={classroom.coverImageUrl}
                sizes="100vw"
              />
            </CardMedia>
          </Link>
          <CardActions
            sx={{ bgcolor: (theme) => theme.palette.background.paper }}
            className="overflow-hidden relative mx-auto flex items-center gap-6"
          >
            <Avatar className="absolute w-20 h-20 -left-5 rounded-full shadow-lg">
              <Image
                className="object-cover"
                layout="fill"
                quality={60}
                alt={`${classroom.instructor.firstname} ${classroom.instructor.lastname}`}
                src={classroom.instructor.profile[0].url}
                sizes="100vw"
              />
            </Avatar>
            <Container className="flex flex-col pl-16">
              <Link
                className="no-underline hover:underline"
                href={`/p/@${classroom.instructor.username}`}
              >
                <Typography
                  variant="body2"
                  noWrap
                  className="font-semibold"
                >{`${classroom.instructor.firstname} ${classroom.instructor.lastname}`}</Typography>
              </Link>
              <Link
                className="no-underline hover:underline"
                href={`/p/@${classroom.instructor.username}`}
              >
                <Typography noWrap variant="caption">
                  @{classroom.instructor.username}
                </Typography>
              </Link>
            </Container>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default ClassroomTeacherCard;

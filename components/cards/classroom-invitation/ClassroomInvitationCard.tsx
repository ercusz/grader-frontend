import { MyClassroomInvitation } from '@/types/types';
import { responseClassroomInvitation } from '@/utils/ClassroomService';
import { getImagePath } from '@/utils/imagePath';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EmailIcon from '@mui/icons-material/Email';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import ClassroomCardSkeleton from '../classroom-skeleton/ClassroomCardSkeleton';

export interface IClassroomInvitationCard {
  invitation: MyClassroomInvitation;
  loading: boolean;
}

const openDialogAtom = atom(false);
const isConfirmDialogAtom = atom(false);

const ClassroomInvitationCard: React.FC<IClassroomInvitationCard> = ({
  invitation,
  loading,
}) => {
  const router = useRouter();
  const { classroom } = invitation;
  const [openDialog, setOpenDialog] = useAtom(openDialogAtom);
  const [isConfirmDialog, setIsConfirmDialog] = useAtom(isConfirmDialogAtom);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (isAccepted: boolean) =>
      responseClassroomInvitation(invitation?.id as number, isAccepted),
    {
      onSuccess: (isAccepted) => {
        queryClient.invalidateQueries(['classrooms', '']);
        alert('ตอบกลับคำเชิญเข้าร่วมคลาสเรียนสำเร็จ');
        if (isAccepted) {
          router.push(`/classroom/${classroom.slug}`);
        } else {
          router.reload();
        }
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการตอบกลับคำเชิญเข้าร่วมคลาสเรียน');
        router.reload();
      },
    }
  );

  const confirmInvitation = () => {
    mutation.mutate(true);
    setOpenDialog(false);
  };

  const rejectInvitation = () => {
    mutation.mutate(false);
    setOpenDialog(false);
  };

  return (
    <>
      {loading ? (
        <ClassroomCardSkeleton />
      ) : (
        classroom &&
        classroom.course && (
          <>
            <Dialog open={openDialog}>
              <DialogTitle>
                {isConfirmDialog
                  ? 'ยืนยันการเข้าร่วมห้องเรียน'
                  : 'ปฏิเสธคำเชิญเข้าร่วมห้องเรียน'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {isConfirmDialog
                    ? 'คุณต้องการเข้าร่วมห้องเรียนนี้ใช่หรือไม่?'
                    : 'คุณต้องการปฏิเสธคำเชิญเข้าร่วมห้องเรียนนี้ใช่หรือไม่?'}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
                <Button
                  onClick={
                    isConfirmDialog ? confirmInvitation : rejectInvitation
                  }
                  variant="contained"
                  color={isConfirmDialog ? 'success' : 'error'}
                  autoFocus
                >
                  ยืนยัน
                </Button>
              </DialogActions>
            </Dialog>
            <Card
              className="transition-all ease-in-out rounded-md
          duration-200 outline outline-1 outline-offset-2
          hover:outline-2 hover:-translate-y-6"
              sx={[
                {
                  height: '100%',
                  flexDirection: 'column',
                  outlineStyle: 'auto',
                  outlineColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
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
                    <Chip
                      className="font-bold"
                      label={classroom.name}
                      color="primary"
                      size="small"
                    />
                    <Typography className="font-bold" noWrap variant="h6">
                      {classroom.course.name}
                    </Typography>
                  </>
                }
                action={
                  <Tooltip
                    title="คำเชิญเข้าร่วมคลาสเรียน"
                    placement="top"
                    arrow
                  >
                    <Fab
                      size="small"
                      aria-label="ส่งงานครบ"
                      color="primary"
                      sx={{
                        marginTop: 1,
                        marginRight: 1,
                        boxShadow: 'none',
                        cursor: 'context-menu',
                      }}
                    >
                      <EmailIcon />
                    </Fab>
                  </Tooltip>
                }
                subheader={
                  classroom.course.semester && classroom.course.year
                    ? `${classroom.course.semester}/${classroom.course.year}`
                    : '\xa0'
                }
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
              <CardActions
                className="overflow-hidden relative mx-auto flex items-center gap-6"
                sx={{
                  bgcolor: (theme) => theme.palette.background.paper,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Avatar className="absolute w-[4.7rem] h-[4.7rem] -left-7 rounded-full shadow-lg">
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
                <Box
                  sx={{ display: 'flex', overflow: 'hidden', paddingLeft: 5 }}
                >
                  <Tooltip
                    title={`${classroom.course.teachers[0].firstName} ${classroom.course.teachers[0].lastName} ได้เชิญคุณเข้าร่วมคลาสเรียนนี้`}
                  >
                    <Typography
                      variant="caption"
                      className="font-semibold"
                      noWrap
                    >
                      {`${classroom.course.teachers[0].firstName} ${classroom.course.teachers[0].lastName}`}
                      <br />
                      <Typography variant="body2" className="font-bold" noWrap>
                        {`ได้เชิญคุณเข้าร่วม`}
                      </Typography>
                    </Typography>
                  </Tooltip>
                </Box>
                <Stack direction="row">
                  <Tooltip title="ปฏิเสธคำเชิญ">
                    <IconButton
                      aria-label="reject-invite"
                      color="error"
                      onClick={() => {
                        setIsConfirmDialog(false);
                        setOpenDialog(true);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="ยอมรับคำเชิญ">
                    <IconButton
                      aria-label="accept-invite"
                      color="success"
                      onClick={() => {
                        setIsConfirmDialog(true);
                        setOpenDialog(true);
                      }}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </CardActions>
            </Card>
          </>
        )
      )}
    </>
  );
};

export default ClassroomInvitationCard;

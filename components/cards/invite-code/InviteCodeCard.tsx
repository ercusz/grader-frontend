import InviteCodeDialog from '@/components/dialogs/invite-code/InviteCodeDialog';
import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { openDialogAtom } from '@/stores/invite-code';
import {
  resetClassroomInviteCode,
  toggleClassroomInviteCode,
} from '@/utils/ClassroomService';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublicIcon from '@mui/icons-material/Public';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { MouseEvent, useState } from 'react';

export interface IInviteCodeCard {
  classroomSlug: string;
}

const InviteCodeCard: React.FC<IInviteCodeCard> = ({ classroomSlug }) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const queryClient = useQueryClient();
  const resetMutation = useMutation(
    (classroomId: number) => resetClassroomInviteCode(classroomId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroomSlug }]);
      },
    }
  );
  interface IToggleClassroomInviteCode {
    classroomId: number;
    state: boolean;
  }
  const toggleMutation = useMutation(
    (params: IToggleClassroomInviteCode) =>
      toggleClassroomInviteCode(params.classroomId, params.state),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroomSlug }]);
      },
    }
  );
  const [, setOpenDialog] = useAtom(openDialogAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorCopiedAlert, setAnchorCopiedAlert] =
    useState<null | HTMLElement>(null);
  const openCopiedAlert = Boolean(anchorCopiedAlert);
  const open = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCopyButton = (event: React.MouseEvent<HTMLLIElement>) => {
    navigator.clipboard.writeText(
      classroom?.inviteCode ? classroom?.inviteCode : 'ไม่พบข้อมูล'
    );
    setAnchorCopiedAlert(event.currentTarget);
    handleCloseMenu();
  };

  const handleResetButton = () => {
    if (classroom) {
      resetMutation.mutate(classroom.id);
    }
    handleCloseMenu();
  };

  const handleToggleButton = () => {
    if (classroom) {
      toggleMutation.mutate({
        classroomId: classroom.id,
        state: classroom.enabledInviteCode,
      });
    }
    handleCloseMenu();
  };

  const handleCloseCopiedAlert = () => {
    setAnchorCopiedAlert(null);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openCopiedAlert}
        autoHideDuration={6000}
        onClose={handleCloseCopiedAlert}
      >
        <Alert
          className="shadow-xl"
          onClose={handleCloseCopiedAlert}
          severity="success"
          sx={{ width: '100%' }}
        >
          คัดลอกรหัสเชิญแล้ว
        </Alert>
      </Snackbar>
      <InviteCodeDialog
        inviteCode={
          classroom?.inviteCode ? classroom?.inviteCode : 'ไม่พบข้อมูล'
        }
      />
      <Card variant="outlined" sx={{ py: 0.5 }}>
        <CardHeader
          sx={{ py: 0 }}
          title={<Typography variant="body2">รหัสเชิญ</Typography>}
          action={
            <IconButton
              aria-controls={open ? 'invite-code-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleMoreButtonClick}
              aria-label="more"
            >
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent sx={{ pt: 0, '&:last-child': { pb: 0 } }}>
          <Stack direction="row" alignItems="center">
            <Typography className="font-bold" variant="h6" sx={{ py: 0 }}>
              {resetMutation.isLoading || toggleMutation.isLoading ? (
                'กำลังโหลด...'
              ) : classroom?.enabledInviteCode === true ? (
                classroom?.inviteCode ? (
                  classroom?.inviteCode
                ) : (
                  'ไม่พบข้อมูล'
                )
              ) : (
                <Tooltip
                  className="cursor-pointer"
                  title="รหัสเชิญถูกปิดใช้งานอยู่"
                >
                  <LockIcon fontSize="inherit" sx={{ mr: 3 }} />
                </Tooltip>
              )}
            </Typography>
            <Tooltip title="แสดง">
              <IconButton onClick={() => setOpenDialog(true)}>
                <FullscreenIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>
      <Menu
        id="invite-code-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'invite-code-menu',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleCopyButton} disableRipple>
          <ContentCopyIcon sx={{ mr: 1 }} />
          คัดลอกรหัสเชิญ
        </MenuItem>
        <MenuItem
          onClick={handleResetButton}
          disableRipple
          disabled={classroom?.enabledInviteCode !== true}
        >
          <RestartAltIcon sx={{ mr: 1 }} />
          รีเซ็ตรหัสเชิญ
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleToggleButton} disableRipple>
          {classroom?.enabledInviteCode === true ? (
            <>
              <LockIcon sx={{ mr: 1 }} />
              ปิดการใช้งาน
            </>
          ) : (
            <>
              <PublicIcon sx={{ mr: 1 }} />
              เปิดการใช้งาน
            </>
          )}
        </MenuItem>
      </Menu>
    </>
  );
};

export default InviteCodeCard;

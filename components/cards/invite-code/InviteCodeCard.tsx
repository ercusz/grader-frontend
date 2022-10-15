import InviteCodeDialog from '@/components/dialogs/invite-code/InviteCodeDialog';
import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { openDialogAtom } from '@/stores/invite-code';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';
import { MouseEvent, useState } from 'react';

export interface IInviteCodeCard {
  classroomSlug: string;
}

const InviteCodeCard: React.FC<IInviteCodeCard> = ({ classroomSlug }) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const [_, setOpenDialog] = useAtom(openDialogAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <InviteCodeDialog
        inviteCode={
          classroom?.inviteCode ? classroom?.inviteCode : 'ไม่พบข้อมูล'
        }
      />
      <Card variant="outlined">
        <CardHeader
          sx={{ pt: 1, pb: 0 }}
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
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography className="font-bold" variant="h6" sx={{ py: 0 }}>
              {classroom?.inviteCode ? classroom?.inviteCode : 'ไม่พบข้อมูล'}
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
        <MenuItem onClick={handleCloseMenu} disableRipple>
          <ContentCopyIcon sx={{ mr: 1 }} />
          คัดลอกรหัสเชิญ
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} disableRipple>
          <RestartAltIcon sx={{ mr: 1 }} />
          รีเซ็ตรหัสเชิญ
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleCloseMenu} disableRipple>
          <CancelPresentationIcon sx={{ mr: 1 }} />
          ปิดการใช้งาน
        </MenuItem>
      </Menu>
    </>
  );
};

export default InviteCodeCard;

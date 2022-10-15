import { fullScreenAtom, openDialogAtom } from '@/stores/invite-code';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAtom } from 'jotai';

export interface IInviteCodeDialog {
  inviteCode: string;
}

const InviteCodeDialog: React.FC<IInviteCodeDialog> = ({ inviteCode }) => {
  const [openDialog, setOpenDialog] = useAtom(openDialogAtom);
  const [fullScreen, setFullScreen] = useAtom(fullScreenAtom);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      open={openDialog}
      onClose={() => {
        setFullScreen(false);
        setOpenDialog(false);
      }}
      aria-labelledby="invite-code-dialog"
      sx={{
        borderRadius: '20px',
      }}
    >
      <DialogTitle id="invite-code-dialog">
        รหัสเชิญ
        {!fullScreen && (
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          className="font-semibold"
          color="primary"
          sx={{
            fontSize: fullScreen ? '20vw' : '8rem',
            borderBottom: '5px solid',
          }}
        >
          {inviteCode}
        </Typography>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => setFullScreen(!fullScreen)}>
          {fullScreen ? (
            <Tooltip title="ย่อ">
              <FullscreenExitIcon fontSize="inherit" />
            </Tooltip>
          ) : (
            <Tooltip title="เต็มจอ">
              <FullscreenIcon fontSize="inherit" />
            </Tooltip>
          )}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default InviteCodeDialog;

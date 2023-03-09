import UploadFileForm from '@/components/forms/upload-file/UploadFileForm';
import { UploadedFile } from '@/types/types';
import { submitStudentSubmission } from '@/utils/SubmissionService';
import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const openCreateSubmissionDialogAtom = atom(false);

export interface ICreateSubmissionDialog {
  assignmentId: string;
  classroomId: string;
}

const filesAtom = atom<UploadedFile[] | null>(null);

const CreateSubmissionDialog: React.FC<ICreateSubmissionDialog> = ({
  assignmentId,
  classroomId,
}) => {
  const theme = useTheme();
  const [files, setFiles] = useAtom(filesAtom);
  const [openDialog, setOpenDialog] = useAtom(openCreateSubmissionDialogAtom);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    () =>
      submitStudentSubmission(
        assignmentId,
        classroomId,
        files?.map((file) => file.fileObj) || []
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['submissions']);
        alert('ส่งงานสำเร็จ');
        setFiles(null);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการส่งงาน');
      },
    }
  );

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    mutation.mutate();
    setOpenDialog(false);
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="create-student-submission-dialog"
      fullWidth
      maxWidth="md"
      sx={{
        borderRadius: '20px',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          color: theme.palette.text.primary,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
          backgroundColor: alpha(theme.palette.background.default, 0.72),
          transition: 'all 0.2s ease-in-out',
          borderBottom: `1px double ${alpha(theme.palette.text.primary, 0.2)}`,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpenDialog(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1 }}
            variant="h6"
            component="span"
            noWrap
          >
            อัปโหลดไฟล์งาน
          </Typography>
          <Button
            autoFocus
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            {files && files.length > 0 ? 'ส่งงาน' : 'ทำเครื่องหมายว่าส่งแล้ว'}
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <UploadFileForm filesAtom={filesAtom} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubmissionDialog;

import FilesSection from '@/components/sections/files/FilesSection';
import { FileResponse } from '@/types/types';
import { submitStudentSubmission } from '@/utils/SubmissionService';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { CSSProperties, forwardRef, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ACCEPTED_FILE_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'application/pdf': [],
  'application/msword': [],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  'application/vnd.ms-powerpoint': [],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    [],
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
  'application/zip': [],
  'application/x-rar-compressed': [],
  'application/x-7z-compressed': [],
};

const MAX_FILES = 10;

const MAX_FILE_SIZE_MB = 50;

const hashCode = (str: string) => {
  return str
    .split('')
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    );
};

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

const CreateSubmissionDialog: React.FC<ICreateSubmissionDialog> = ({
  assignmentId,
  classroomId,
}) => {
  const theme = useTheme();
  const [files, setFiles] = useState<Array<
    FileResponse & { fileObj: File }
  > | null>(null);
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

  const fileSizeValidation = (file: File) => {
    const fileSize = file.size / 1024 / 1024; // Convert Bytes to MB
    if (fileSize > MAX_FILE_SIZE_MB) {
      return {
        code: 'file-too-large',
        message: `ไฟล์มีขนาดใหญ่กว่า ${MAX_FILE_SIZE_MB} MB`,
      };
    }
    return null;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: MAX_FILES,
    validator: fileSizeValidation,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        // Validate number of files
        const isTooManyFiles = rejectedFiles.some(({ errors }) => {
          if (errors.length > 0) {
            if (errors[0].code === 'too-many-files') {
              return true;
            }
          }
        });

        if (isTooManyFiles) {
          alert('ไฟล์ที่อัปโหลดเกินจำนวนที่กำหนด กรุณาอัปโหลดใหม่อีกครั้ง');
          return;
        }

        // Validate file type
        const invalidFileTypeNames = rejectedFiles
          .filter(({ errors }) => {
            if (errors.length > 0) {
              if (errors[0].code === 'file-invalid-type') {
                return true;
              }
            }
          })
          .map(({ file }) => file.name)
          .join(', ');

        if (invalidFileTypeNames.length > 0) {
          alert(
            `พบไฟล์ที่ไม่รองรับ ได้แก่ ${invalidFileTypeNames} กรุณาอัปโหลดใหม่อีกครั้ง`
          );
          return;
        }

        // Validate file size
        const largeFiles = rejectedFiles
          .filter(({ errors }) => {
            if (errors.length > 0) {
              if (errors[0].code === 'file-too-large') {
                return true;
              }
            }
          })
          .map(({ file }) => file.name)
          .join(', ');

        if (largeFiles.length > 0) {
          alert(
            `พบไฟล์ที่มีขนาดใหญ่กว่า ${MAX_FILE_SIZE_MB} MB ได้แก่ ${largeFiles} กรุณาอัปโหลดใหม่อีกครั้ง`
          );
          return;
        }

        alert('พบข้อผิดพลาดในการอัปโหลดไฟล์ กรุณาลองอีกครั้ง');
        return;
      }

      const uploadedFiles: Array<FileResponse & { fileObj: File }> | null =
        acceptedFiles.map((file) => {
          return {
            id:
              hashCode(file.name) +
              new Date().valueOf() +
              Math.floor(Math.random()),
            name: file.name,
            url: URL.createObjectURL(file),
            ext: file.name.slice(file.name.lastIndexOf('.')),
            mime: file.type,
            size: file.size / 1024, // Convert Bytes to KB
            createdAt: new Date().toISOString(),
            fileObj: file,
          };
        });

      if (files && files.length + uploadedFiles.length > MAX_FILES) {
        alert(
          `ไฟล์ที่อัปโหลดเกินจำนวนที่กำหนด กรุณาลบไฟล์เก่าและอัปโหลดใหม่อีกครั้ง`
        );
        return;
      }

      setFiles(
        (prevFiles) => prevFiles?.concat(uploadedFiles) || uploadedFiles || null
      );
    },
  });

  const style: CSSProperties = useMemo(
    () => ({
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      padding: '20px',
      borderWidth: 1,
      borderRadius: 2,
      borderColor: theme.palette.text.primary,
      borderStyle: 'dashed',
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      outline: 'none',
      transition: 'border .24s ease-in-out',
      cursor: 'pointer',
    }),
    [theme.palette.text.primary]
  );

  const handleClose = () => {
    setOpenDialog(false);
  };

  const onDelete = (id: number) => {
    if (files) {
      const newFiles = files.filter((file) => file.id !== id);
      setFiles(newFiles);
    }
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
        {/* Drag & Drop Upload Zone */}
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            mb: 1,
          }}
        >
          <Box {...getRootProps({ style })} className="text-center w-full">
            <input {...getInputProps()} />
            <CloudUploadIcon fontSize="large" />
            <Typography variant="h6">
              ลากไฟล์มาวางในกล่องนี้ หรือคลิกเพื่อเลือกไฟล์
            </Typography>
            <Typography variant="body2" color="textSecondary">
              สามารถอัปโหลดได้สูงสุด {MAX_FILES} ไฟล์ ขนาดสูงสุด{' '}
              {MAX_FILE_SIZE_MB} MB/ไฟล์
            </Typography>
            <Typography variant="body2" color="textSecondary">
              รองรับไฟล์ .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .png,
              .jpeg, .jpg, .zip, .rar, .7z เท่านั้น
            </Typography>
          </Box>
        </Paper>

        {/* Preview Files */}
        <Stack direction="column" spacing={1}>
          {files && (
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <FilesSection
                deletable
                onDelete={onDelete}
                defaultOpen
                files={files}
              />
            </Paper>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubmissionDialog;

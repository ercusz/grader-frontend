import { CreateCourseClassroom } from '@/types/types';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';

export interface IUploadedStudentsDialog {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  classroom: CreateCourseClassroom;
}

function getColor(num: number) {
  return '#' + Math.floor((num % 3) * 1337).toString(16);
}

const UploadedStudentsDialog: React.FC<IUploadedStudentsDialog> = ({
  open,
  setOpen,
  classroom,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} scroll="paper" fullWidth>
      <DialogTitle>
        กลุ่มการเรียน: {classroom.name}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <List>
          {classroom.students?.map((studentId: string) => {
            const studentYear = parseInt(studentId.substring(0, 2));
            const bgColor = getColor(studentYear);

            return (
              <ListItem key={studentId}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: bgColor }}>{studentYear}</Avatar>
                </ListItemIcon>
                <ListItemText primary={studentId} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        {classroom.students &&
          `จำนวนนักศึกษาทั้งหมด ${classroom.students.length} คน`}
      </DialogActions>
    </Dialog>
  );
};

export default UploadedStudentsDialog;

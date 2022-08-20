import { InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface INewFileDialog {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formContext: UseFormReturn<{ filename: string }, any>;
  onSubmit: () => void;
}

const NewFileDialog: React.FC<INewFileDialog> = ({
  open,
  setOpen,
  formContext,
  onSubmit
}) => {
  const { watch, formState: { errors, isDirty, isValid } } = formContext;

  const fileName = watch('filename');

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <DialogTitle>เพิ่มไฟล์ใหม่</DialogTitle>
      <DialogContent>
        <DialogContentText>
          กรอกชื่อไฟล์ที่คุณต้องการสร้าง **ไม่ต้องใส่นามสกุลไฟล์**
        </DialogContentText>
          <TextFieldElement
            name="filename"
            autoFocus
            margin="dense"
            label="ชื่อไฟล์"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">.java</InputAdornment>
              ),
            }}
            validation={{
              required: { value: true, message: 'คุณจำเป็นต้องกรอก ชื่อไฟล์' },
              pattern: {
                value: /^[\w\-. ]{1,32}$/,
                message: 'กรุณากรอกชื่อไฟล์ให้ถูกต้อง',
              },
            }}
          />
        <DialogContentText variant="caption" style={{ whiteSpace: 'pre' }}>
          {fileName?.replace(/\s/g, '') !== ''
            ? 'ชื่อไฟล์ที่จะสร้างใหม่ คือ \n' + fileName + '.java'
            : ''}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="submit"
          disabled={!isDirty && !isValid}
        >
          Confirm
        </Button>
      </DialogActions>
      </FormContainer>

    </Dialog>
  );
};

export default NewFileDialog;

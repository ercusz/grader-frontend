import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface IDeleteConfirmationDialog {
  actionName: string;
  confirmText: string;
  open: boolean;
  handleClose: () => void;
  onSubmit: () => void;
}

const DeleteConfirmationDialog: React.FC<IDeleteConfirmationDialog> = ({
  actionName,
  confirmText,
  open,
  handleClose,
  onSubmit,
}) => {
  const formContext = useForm();
  const { handleSubmit } = formContext;

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <DeleteForeverIcon fontSize="large" />
          ทำการลบ &ldquo;{actionName}&rdquo;
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning">หากลบแล้วคุณจะไม่สามารถกู้คืนได้อีก</Alert>
        <DialogContentText
          sx={{ whiteSpace: 'pre-wrap', pb: 2 }}
        ></DialogContentText>
        <FormContainer formContext={formContext}>
          <TextFieldElement
            autoComplete="off"
            fullWidth
            label={`กรอกคำว่า ${confirmText} เพื่อยืนยันการลบ`}
            name="name"
            validation={{
              pattern: {
                value: new RegExp(confirmText),
                message: 'กรุณากรอกข้อมูลให้ถูกต้อง',
              },
              required: {
                value: true,
                message: `คุณจำเป็นต้องกรอกคำว่า ${confirmText} เพื่อยืนยันการลบ`,
              },
            }}
          />
        </FormContainer>
      </DialogContent>
      <DialogActions sx={{ px: 3.5, py: 4 }}>
        <Button onClick={handleClose}>ยกเลิก</Button>
        <Button
          onClick={() => handleSubmit(onSubmit)()}
          variant="contained"
          color="error"
        >
          ยืนยันการลบ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;

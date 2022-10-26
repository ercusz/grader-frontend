import { joinClassroomByInviteCode } from '@/utils/ClassroomService';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface IJoinClassroomDialog {
  open: boolean;
  handleClose: () => void;
}

const JoinClassroomDialog: React.FC<IJoinClassroomDialog> = ({
  open,
  handleClose,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (inviteCode: string) => joinClassroomByInviteCode(inviteCode),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classrooms', '']);
        alert('เข้าร่วมคลาสเรียนสำเร็จ');
        handleClose();
        router.reload();
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการเข้าร่วมคลาสเรียน');
        handleClose();
      },
    }
  );
  const formContext = useForm();
  const { handleSubmit } = formContext;

  const onSubmit = () => {
    mutation.mutate(formContext.getValues().inviteCode);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <ConfirmationNumberIcon fontSize="large" sx={{ mr: 1 }} />
          เข้าร่วมคลาสเรียน
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert severity="info">
          คุณสามารถขอรหัสเชิญได้จากอาจารย์ผู้สอนประจำวิชา
        </Alert>
        <DialogContentText
          sx={{ whiteSpace: 'pre-wrap', pb: 2 }}
        ></DialogContentText>
        <FormContainer formContext={formContext}>
          <TextFieldElement
            autoComplete="off"
            fullWidth
            label={`รหัสเชิญ`}
            name="inviteCode"
            onKeyPress={(e) => {
              e.key === 'Enter' && e.preventDefault();
            }}
            validation={{
              pattern: {
                value: /^[a-z0-9_-]{6,7}$/,
                message: 'กรุณากรอกรหัสเชิญให้ถูกต้อง',
              },
              required: {
                value: true,
                message: `คุณจำเป็นต้องกรอกรหัสเชิญเพื่อเข้าร่วมคลาสเรียน`,
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
          color="success"
        >
          เข้าร่วม
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinClassroomDialog;

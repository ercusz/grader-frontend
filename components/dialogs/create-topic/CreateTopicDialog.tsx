import { classroomAtom } from '@/components/forms/topic/TopicForm';
import { openCreateTopicDialogAtom } from '@/stores/create-topic';
import { CreateTopic } from '@/types/types';
import { createTopic } from '@/utils/TopicServices';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import * as React from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

export interface ICreateTopicDialog {}

const CreateTopicDialog: React.FC<ICreateTopicDialog> = () => {
  const [open, setOpen] = useAtom(openCreateTopicDialogAtom);
  const [classroom] = useAtom(classroomAtom);

  const formContext = useForm({
    defaultValues: {
      name: '',
    },
  });

  const {
    formState: { isDirty },
    reset,
  } = formContext;

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (body: CreateTopic) =>
      createTopic(classroom?.id.toString() as string, body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topics']);
        alert('สร้างหัวข้อสำเร็จ');
        reset();
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการสร้างหัวข้อ');
      },
    }
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const name = formContext.getValues('name');
    mutation.mutate({ name });
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>เพิ่มหัวข้อใหม่</DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext}>
          <TextFieldElement
            autoFocus
            name="name"
            margin="dense"
            label="ชื่อหัวข้อ"
            type="text"
            autoComplete="off"
            fullWidth
            variant="outlined"
          />
        </FormContainer>
        {classroom && (
          <DialogContentText variant="caption">
            หัวข้อนี้จะถูกเพิ่มไปยังคลาสเรียน {classroom.name}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ยกเลิก</Button>
        <Button
          variant={isDirty ? 'contained' : 'text'}
          onClick={handleSubmit}
          disabled={!isDirty}
        >
          เพิ่มหัวข้อ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTopicDialog;

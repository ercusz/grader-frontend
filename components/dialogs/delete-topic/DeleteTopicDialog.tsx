import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { TopicWithAssignments } from '@/types/types';
import { deleteTopic, deleteTopicAndAssignments } from '@/utils/TopicServices';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export interface IDeleteTopicDialog {
  classroomSlug: string;
  topic: TopicWithAssignments;
}

export const openDeleteTopicDialogAtom = atom(false);

const DeleteTopicDialog: React.FC<IDeleteTopicDialog> = ({
  classroomSlug,
  topic,
}) => {
  const router = useRouter();
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const [openDialog, setOpenDialog] = useAtom(openDeleteTopicDialogAtom);
  const [value, setValue] = useState('onlyTopic');
  const [helperText, setHelperText] = useState('');

  const queryClient = useQueryClient();
  const deleteTopicMutation = useMutation(
    () =>
      deleteTopic(
        topic.id.toString() as string,
        classroom?.id.toString() as string
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topics']);
        alert('ลบหัวข้อสำเร็จ');
        router.push(`/classroom/${classroomSlug}`);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบหัวข้อ');
      },
    }
  );

  const deleteTopicAndAssignmentMutation = useMutation(
    () =>
      deleteTopicAndAssignments(
        topic.id.toString() as string,
        classroom?.id.toString() as string
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topics']);
        queryClient.invalidateQueries(['assignments']);
        alert('ลบหัวข้อและงานในหัวข้อสำเร็จ');
        router.push(`/classroom/${classroomSlug}`);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบหัวข้อและงานในหัวข้อ');
      },
    }
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleDelete = () => {
    if (value === 'onlyTopic') {
      deleteTopicMutation.mutate();
    }

    if (value === 'all') {
      deleteTopicAndAssignmentMutation.mutate();
    }

    setOpenDialog(false);
  };

  useEffect(() => {
    if (value === 'onlyTopic') {
      setHelperText('แต่งานทั้งหมดในหัวข้อนี้จะไม่ถูกลบ');
    }

    if (value === 'all') {
      setHelperText('และงานทั้งหมดในหัวข้อนี้จะถูกลบเช่นเดียวกัน');
    }
  }, [value]);

  return (
    <Dialog open={openDialog} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <DeleteForeverIcon fontSize="large" />
          ทำการลบหัวข้อ &ldquo;{topic.name}&rdquo;
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ whiteSpace: 'pre' }}>
          <AlertTitle>คำเตือน</AlertTitle>
          หัวข้อนี้จะถูกลบ
          <br />
          <strong>{helperText}</strong>
        </Alert>
        <FormControl sx={{ my: 2 }}>
          <FormLabel id="deleteChoices">ตัวเลือกการลบ</FormLabel>
          <RadioGroup
            aria-labelledby="deleteChoices"
            name="deleteChoices"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="onlyTopic"
              control={<Radio />}
              label="ลบเฉพาะหัวข้อนี้"
            />
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="ลบหัวข้อนี้ และงานในหัวข้อนี้ทั้งหมด"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3.5 }}>
        <Stack
          direction="column"
          justifyContent="flex-end"
          alignItems="flex-end"
          spacing={1}
        >
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
            <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
            <Button
              onClick={() => handleDelete()}
              variant="contained"
              color="error"
            >
              ยืนยันการลบ
            </Button>
          </Stack>
          <Typography className="font-bold" variant="caption" color="error">
            หากลบแล้วคุณจะไม่สามารถกู้คืนได้อีก
          </Typography>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTopicDialog;

import DeleteConfirmationDialog from '@/components/dialogs/delete-confirmation/DeleteConfirmationDialog';
import { unsavedChangesAtom } from '@/components/dialogs/edit-course-info/EditCourseInfoDialog';
import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { openEditCourseDialogAtom } from '@/stores/edit-course';
import { deleteClassroom } from '@/utils/ClassroomService';
import { Button, Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface IEditClassroomInfoForm {
  classroomSlug: string;
}

const deleteDialogAtom = atom(false);

const EditClassroomInfoForm: React.FC<IEditClassroomInfoForm> = ({
  classroomSlug,
}) => {
  const router = useRouter();
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    (classroomId: number) => deleteClassroom(classroomId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'course',
          { slug: classroom?.course.slug },
        ]);
        alert('ลบกลุ่มการเรียนสำเร็จ');
        setOpenDialog(false);
        router.push(`/course/${classroom?.course.slug}`);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบข้อมูลกลุ่มการเรียน');
        setOpenDeleteDialog(false);
      },
    }
  );
  const [, setOpenDialog] = useAtom(openEditCourseDialogAtom);
  const [openDeleteDialog, setOpenDeleteDialog] = useAtom(deleteDialogAtom);
  const [, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  const defaultValues = useMemo(() => {
    return {
      name: classroom?.name,
    };
  }, [classroom]);

  const classroomInfoFormContext = useForm({
    defaultValues: defaultValues,
  });

  const { watch } = classroomInfoFormContext;
  const formData = watch();

  useEffect(() => {
    const courseData = {
      name: classroom?.name,
    };
    if (JSON.stringify(formData) !== JSON.stringify(courseData)) {
      setUnsavedChanges(true);
    }
  }, [formData, classroom, setUnsavedChanges]);

  const handleSubmit = () => {
    alert(JSON.stringify(formData));
    setUnsavedChanges(false);
  };

  const handleDelete = () => {
    if (classroom) {
      deleteMutation.mutate(classroom.id);
    }
    setUnsavedChanges(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <DeleteConfirmationDialog
        actionName={`กลุ่มการเรียน ${classroom?.name}`}
        confirmText={classroom?.name as string}
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        onSubmit={handleDelete}
      />
      <FormContainer
        formContext={classroomInfoFormContext}
        onSuccess={handleSubmit}
      >
        <Stack
          sx={{ pt: 2 }}
          direction="column"
          spacing={2}
          justifyContent="center"
        >
          <TextFieldElement
            fullWidth
            label="ชื่อกลุ่มการเรียน (จำเป็น)"
            name="name"
            validation={{
              required: {
                value: true,
                message: 'คุณจำเป็นต้องกรอก ชื่อกลุ่มการเรียน',
              },
            }}
          />
        </Stack>
        <Button type="submit" variant="contained" sx={{ my: 3, mr: 2 }}>
          อัปเดตข้อมูลกลุ่มการเรียน
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenDeleteDialog(true)}
          sx={{ my: 3 }}
        >
          ลบกลุ่มการเรียน
        </Button>
      </FormContainer>
    </>
  );
};

export default EditClassroomInfoForm;

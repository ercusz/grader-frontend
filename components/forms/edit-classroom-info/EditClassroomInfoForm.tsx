import DeleteConfirmationDialog from '@/components/dialogs/delete-confirmation/DeleteConfirmationDialog';
import { unsavedChangesAtom } from '@/components/dialogs/edit-course-info/EditCourseInfoDialog';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useUser } from '@/hooks/user/useUser';
import { openEditCourseDialogAtom } from '@/stores/edit-course';
import { deleteClassroom, updateClassroomInfo } from '@/utils/ClassroomService';
import { Button, Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface IEditClassroomInfoForm {
  classroomSlug: string;
}

const deleteDialogAtom = atom(false);

const EditClassroomInfoForm: React.FC<IEditClassroomInfoForm> = ({
  classroomSlug,
}) => {
  const { data: user } = useUser();
  const router = useRouter();
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: { name: string }) =>
      updateClassroomInfo(data, classroom?.id as number),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['classroom', { slug: classroomSlug }]);
        alert('อัปเดตข้อมูลกลุ่มการเรียนสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลกลุ่มการเรียน');
      },
    }
  );
  const deleteMutation = useMutation(
    (classroomId: number) => deleteClassroom(classroomId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'course',
          { slug: classroom?.course.slug },
        ]);
        alert('ลบกลุ่มการเรียนสำเร็จ');
        setOpenDeleteDialog(false);
        setOpenEditDialog(false);
        router.push(`/course/${classroom?.course.slug}`);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบข้อมูลกลุ่มการเรียน');
        setOpenDeleteDialog(false);
      },
    }
  );
  const [, setOpenEditDialog] = useAtom(openEditCourseDialogAtom);
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

  const handleSubmit = () => {
    if (formData.name) {
      mutation.mutate(formData as { name: string });
    }
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
        {user?.role.name === 'Teacher' && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
            sx={{ my: 3 }}
          >
            ลบกลุ่มการเรียน
          </Button>
        )}
      </FormContainer>
    </>
  );
};

export default EditClassroomInfoForm;

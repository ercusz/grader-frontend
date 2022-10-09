import { unsavedChangesAtom } from '@/components/dialogs/edit-course-info/EditCourseInfoDialog';
import { useClassroomSlug } from '@/states/classrooms/useClassrooms';
import { Button, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface IEditClassroomInfoForm {
  classroomSlug: string;
}

const EditClassroomInfoForm: React.FC<IEditClassroomInfoForm> = ({
  classroomSlug,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const [_, setUnsavedChanges] = useAtom(unsavedChangesAtom);

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

  return (
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
      <Button type="submit" variant="contained" sx={{ my: 3 }}>
        อัปเดตข้อมูลกลุ่มการเรียน
      </Button>
    </FormContainer>
  );
};

export default EditClassroomInfoForm;

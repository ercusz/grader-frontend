import { unsavedChangesAtom } from '@/components/dialogs/edit-course-info/EditCourseInfoDialog';
import { useCourseSlug } from '@/states/courses/useCourses';
import { Button } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import CreateCourseForm from '../create-course-form/CreateCourseForm';

export interface IEditCourseInfoForm {
  courseSlug: string;
}

const EditCourseInfoForm: React.FC<IEditCourseInfoForm> = ({ courseSlug }) => {
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const [_, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  const defaultValues = useMemo(() => {
    return {
      name: course?.name,
      code: course?.code,
      semester: course?.semester,
      year: course?.year,
    };
  }, [course]);

  const courseInfoFormContext = useForm({
    defaultValues: defaultValues,
  });

  const { watch } = courseInfoFormContext;
  const formData = watch();

  useEffect(() => {
    const courseData = {
      name: course?.name,
      code: course?.code,
      semester: course?.semester,
      year: course?.year,
    };
    if (JSON.stringify(formData) !== JSON.stringify(courseData)) {
      setUnsavedChanges(true);
    }
  }, [formData, course, setUnsavedChanges]);

  const handleSubmit = () => {
    alert(JSON.stringify(formData));
    setUnsavedChanges(false);
  };

  return (
    <>
      <CreateCourseForm formContext={courseInfoFormContext} />
      <Button variant="contained" onClick={handleSubmit} sx={{ my: 3 }}>
        อัปเดตข้อมูลรายวิชา
      </Button>
    </>
  );
};

export default EditCourseInfoForm;

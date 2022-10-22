import { unsavedChangesAtom } from '@/components/dialogs/edit-course-info/EditCourseInfoDialog';
import { useCourseSlug } from '@/states/courses/useCourses';
import { CreateCourseReq } from '@/types/types';
import { updateCourseInfo } from '@/utils/ClassroomService';
import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import CreateCourseForm from '../create-course-form/CreateCourseForm';

export interface IEditCourseInfoForm {
  courseSlug: string;
}

const EditCourseInfoForm: React.FC<IEditCourseInfoForm> = ({ courseSlug }) => {
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const queryClient = useQueryClient();
  interface IUpdateCourseInfo {
    data: CreateCourseReq;
    courseId: number;
  }
  const mutation = useMutation(
    (params: IUpdateCourseInfo) =>
      updateCourseInfo(params.data, params.courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', { slug: courseSlug }]);
        alert('อัปเดตข้อมูลรายวิชาสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลรายวิชา');
      },
    }
  );

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

  const handleSubmit = () => {
    if (course && formData && formData.name) {
      let data = {
        name: formData!.name,
        code: formData!.code,
        semester: formData!.semester,
        year: formData!.year,
      };
      mutation.mutate({ data: data, courseId: course?.id });
    }
    setUnsavedChanges(false);
  };

  const handleDelete = () => {
    alert('Course deleted!');
    setUnsavedChanges(false);
  };

  return (
    <>
      <CreateCourseForm formContext={courseInfoFormContext} />
      <Button variant="contained" onClick={handleSubmit} sx={{ my: 3, mr: 2 }}>
        อัปเดตข้อมูลรายวิชา
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={handleDelete}
        sx={{ my: 3 }}
      >
        ลบรายวิชา
      </Button>
    </>
  );
};

export default EditCourseInfoForm;

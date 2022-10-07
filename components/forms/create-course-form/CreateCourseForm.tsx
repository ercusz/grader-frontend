import { Stack } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { CourseDetail } from '@/types/types';

export interface ICreateCourseForm {
  formContext: UseFormReturn<CourseDetail, any>;
}

const CreateCourseForm: React.FC<ICreateCourseForm> = ({ formContext }) => {
  return (
    <FormContainer formContext={formContext}>
      <Stack
        sx={{ pt: 2 }}
        direction="column"
        spacing={2}
        justifyContent="center"
      >
        <TextFieldElement
          fullWidth
          label="ชื่อวิชา (จำเป็น)"
          name="name"
          validation={{
            required: { value: true, message: 'คุณจำเป็นต้องกรอก ชื่อวิชา' },
          }}
        />
        <TextFieldElement fullWidth label="รหัสวิชา" name="code" />
        <TextFieldElement
          fullWidth
          label="ภาคเรียน"
          name="semester"
          validation={{
            pattern: {
              value: /^[0-9]{1}$/,
              message: 'กรุณากรอกภาคเรียนให้ถูกต้อง',
            },
          }}
        />
        <TextFieldElement
          fullWidth
          label="ปีการศึกษา"
          name="year"
          validation={{
            pattern: {
              value: /^[2][0-9]{3}$/,
              message: 'กรุณากรอกปีการศึกษาให้ถูกต้อง',
            },
          }}
        />
      </Stack>
    </FormContainer>
  );
};

export default CreateCourseForm;

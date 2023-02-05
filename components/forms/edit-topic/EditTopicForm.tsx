import TransferAssignmentList from '@/components/lists/transfer-assignment/TransferAssignmentList';
import { Stack, Typography } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface IEditTopicForm {
  formContext: UseFormReturn<{ name: string }, any>;
}

const EditTopicForm: React.FC<IEditTopicForm> = ({ formContext }) => {
  return (
    <>
      <FormContainer formContext={formContext}>
        <Stack
          sx={{ pt: 2, pb: 6 }}
          direction="column"
          spacing={2}
          justifyContent="center"
        >
          <TextFieldElement
            fullWidth
            autoComplete="off"
            label="ชื่อหัวข้อ"
            name="name"
            validation={{
              required: {
                value: true,
                message: 'คุณจำเป็นต้องกรอก ชื่อหัวข้อ',
              },
            }}
          />
          <Typography variant="h6" component="div" noWrap sx={{ pt: 2 }}>
            จัดการงานในหัวข้อนี้
          </Typography>
          <TransferAssignmentList />
        </Stack>
      </FormContainer>
    </>
  );
};

export default EditTopicForm;

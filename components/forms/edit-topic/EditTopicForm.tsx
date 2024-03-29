import TransferList from '@/components/lists/transfer/TransferList';
import {
  defaultLeftAssignmentAtom,
  defaultLeftMaterialAtom,
  defaultRightAssignmentAtom,
  defaultRightMaterialAtom,
} from '@/stores/edit-topic';
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
          <TransferList
            defaultLeftAtom={defaultLeftAssignmentAtom}
            defaultRightAtom={defaultRightAssignmentAtom}
          />

          <Typography variant="h6" component="div" noWrap sx={{ pt: 2 }}>
            จัดการเอกสารในหัวข้อนี้
          </Typography>
          <TransferList
            defaultLeftAtom={defaultLeftMaterialAtom}
            defaultRightAtom={defaultRightMaterialAtom}
          />
        </Stack>
      </FormContainer>
    </>
  );
};

export default EditTopicForm;

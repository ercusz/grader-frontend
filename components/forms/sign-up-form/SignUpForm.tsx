import { Button, Stack } from '@mui/material';
import {
  FormContainer,
  PasswordElement,
  PasswordRepeatElement,
  TextFieldElement,
} from 'react-hook-form-mui';

export interface ISignUpForm {
  onSubmit: any;
}

const SignUpForm: React.FC<ISignUpForm> = ({ onSubmit }) => {
  return (
    <FormContainer onSuccess={(data) => onSubmit(data)}>
      <Stack
        sx={{ pt: 2 }}
        direction="column"
        spacing={2}
        justifyContent="center"
      >
        <TextFieldElement
          fullWidth
          label="อีเมล"
          name="email"
          type="email"
          validation={{
            required: { value: true, message: 'คุณจำเป็นต้องกรอก อีเมล' },
            pattern: {
              value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
              message: 'กรุณากรอกอีเมลให้ถูกต้อง',
            },
          }}
        />
        <TextFieldElement
          fullWidth
          label="ชื่อผู้ใช้"
          name="username"
          validation={{
            required: { value: true, message: 'คุณจำเป็นต้องกรอก ชื่อผู้ใช้' },
            pattern: {
              value: /^[a-z0-9_-]{6,20}$/,
              message:
                'กรุณากรอก Username ให้ถูกต้อง ตาม format ดังนี้ \n ตัวอักษรภาษาอังกฤษพิมพ์เล็ก-ใหญ่ ตัวเลข 0-9 ขีด(-) ขีดล่าง(_) \n ความยาวตั้งแต่ 6-20 ตัว',
            },
          }}
        />
        <PasswordElement
          fullWidth
          margin="dense"
          label="รหัสผ่าน"
          name="password"
          validation={{
            required: { value: true, message: 'คุณจำเป็นต้องกรอก รหัสผ่าน' },
          }}
        />
        <PasswordRepeatElement
          passwordFieldName={'password'}
          fullWidth
          margin="dense"
          label="ยืนยันรหัสผ่าน"
          name="confirm_password"
          validation={{
            required: {
              value: true,
              message: 'คุณจำเป็นต้องกรอก รหัสผ่าน อีกครั้ง',
            },
          }}
        />
        <Button
          className="font-bold"
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
        >
          สร้างบัญชี
        </Button>
      </Stack>
    </FormContainer>
  );
};

export default SignUpForm;

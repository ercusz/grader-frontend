import { Button, Stack } from '@mui/material';
import {
  FormContainer,
  PasswordElement,
  TextFieldElement,
} from 'react-hook-form-mui';

export interface ISignInForm {
  onSubmit: any;
}

const SignInForm: React.FC<ISignInForm> = ({ onSubmit }) => {
  return (
    <FormContainer
      defaultValues={{ email: '', password: '' }}
      onSuccess={(data) => onSubmit(data)}
    >
      <Stack
        sx={{ pt: 2 }}
        direction="column"
        spacing={2}
        justifyContent="center"
      >
        <TextFieldElement
          fullWidth
          label="Email"
          name="email"
          type="email"
          required
        />
        <PasswordElement
          fullWidth
          margin="dense"
          label="Password"
          name="password"
          required
        />
        <Button className="font-bold" fullWidth type="submit" variant="contained" color="primary">
          ลงชื่อเข้าใช้
        </Button>
      </Stack>
    </FormContainer>
  );
};

export default SignInForm;

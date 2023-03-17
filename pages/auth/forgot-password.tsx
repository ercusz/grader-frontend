import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { forgotPassword } from '@/utils/AuthService';
import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { NextPageWithLayout } from '../page';

const ForgotPassword: NextPageWithLayout = () => {
  const router = useRouter();

  const [openAlert, setOpenAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('เกิดข้อผิดพลาดไม่ทราบสาเหตุ');

  const formContext = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async () => {
    const email = formContext.getValues('email');
    const res = await forgotPassword(email);

    if (!res?.errorMsg) {
      alert('ระบบได้ส่งลิงก์สำหรับการเปลี่ยนรหัสผ่านไปยังอีเมลของคุณแล้ว');
      router.replace('/');
      return;
    }

    setErrorMsg(res.errorMsg);
    setOpenAlert(true);
  };

  return (
    <section>
      <Grid container className="min-h-screen">
        <Grid
          item
          xs={false}
          sm={false}
          md={6}
          sx={{
            backgroundImage: 'url(/forgot-pw.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', sm: 'none', md: 'block' },
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        />
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          pb={4}
          px={4}
          pt={10}
          my="auto"
          alignItems="center"
          justifyContent="center"
          justifyItems="center"
          maxWidth="sm"
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            ลืมรหัสผ่าน
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
          >
            &ldquo;👨‍💻grade้r — helps you improve your coding skills&rdquo;
          </Typography>
          <Collapse in={openAlert}>
            <Alert severity="error">
              <AlertTitle className="font-bold">
                เกิดข้อผิดพลาดในการส่งลิงก์เปลี่ยนรหัสผ่าน
              </AlertTitle>
              <Typography variant="subtitle1">{errorMsg}</Typography>
            </Alert>
          </Collapse>
          <FormContainer formContext={formContext} onSuccess={onSubmit}>
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
                required
                validation={{
                  required: {
                    value: true,
                    message: 'คุณจำเป็นต้องกรอก อีเมล',
                  },
                  pattern: {
                    value: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/,
                    message: 'กรุณากรอกอีเมลให้ถูกต้อง',
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
                ยืนยัน
              </Button>
            </Stack>
          </FormContainer>
          <Divider sx={{ my: 2 }}>ยังไม่มีบัญชี?</Divider>
          <Link href="sign-up" passHref>
            <Button fullWidth variant="outlined" color="primary">
              สร้างบัญชี
            </Button>
          </Link>
        </Grid>
      </Grid>
    </section>
  );
};

export default ForgotPassword;

ForgotPassword.getLayout = (page) => {
  return <PrimaryLayout title="ลืมรหัสผ่าน">{page}</PrimaryLayout>;
};

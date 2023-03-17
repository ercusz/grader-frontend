import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { resetPassword } from '@/utils/AuthService';
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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, PasswordElement } from 'react-hook-form-mui';
import { NextPageWithLayout } from '../page';

const ResetPassword: NextPageWithLayout = () => {
  const router = useRouter();
  const code = router.query.code as string;

  const [openAlert, setOpenAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('เกิดข้อผิดพลาดไม่ทราบสาเหตุ');

  const formContext = useForm({
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    if (!code) {
      router.push('/404');
    }
  }, [code, router]);

  const onSubmit = async () => {
    const password = formContext.getValues('newPassword');
    const passwordConfirm = formContext.getValues('confirmNewPassword');
    const res = await resetPassword(code, password, passwordConfirm);

    if (!res?.errorMsg) {
      alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
      router.replace('/auth/sign-in');
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
            backgroundImage: 'url(/reset-pw.jpg)',
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
              <PasswordElement
                name="newPassword"
                fullWidth
                label="รหัสผ่านใหม่"
                required
                validation={{
                  required: {
                    value: true,
                    message: `คุณจำเป็นต้องกรอกรหัสผ่านใหม่`,
                  },
                  min: {
                    value: 6,
                    message: `รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร`,
                  },
                }}
              />
              <PasswordElement
                name="confirmNewPassword"
                fullWidth
                label="ยืนยันรหัสผ่านใหม่"
                required
                validation={{
                  required: {
                    value: true,
                    message: `คุณจำเป็นต้องกรอกรหัสผ่านใหม่อีกครั้ง`,
                  },
                  min: {
                    value: 6,
                    message: `รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร`,
                  },
                  validate: (value) => {
                    if (value !== formContext.getValues().newPassword) {
                      return `รหัสผ่านไม่ตรงกัน`;
                    }
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
                เปลี่ยนรหัสผ่าน
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

export default ResetPassword;

ResetPassword.getLayout = (page) => {
  return <PrimaryLayout title="รีเซ็ตรหัสผ่าน">{page}</PrimaryLayout>;
};

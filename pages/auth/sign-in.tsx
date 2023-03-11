import SignInForm from '@/components/forms/sign-in-form/SignInForm';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Divider,
  Grid,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NextPageWithLayout } from '../page';

const SignIn: NextPageWithLayout = () => {
  const router = useRouter();

  const [openAlert, setOpenAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('เกิดข้อผิดพลาดไม่ทราบสาเหตุ');

  const onSubmit = async (data: { identifier: string; password: string }) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      setErrorMsg(result.error);
      if (result.error === 'Invalid identifier or password') {
        setErrorMsg('ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง');
      }
    }

    if (result!.ok && !result?.error) {
      router.replace('/');
      return;
    }

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
            backgroundImage: 'url(/sign-in.jpg)',
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
            ลงชื่อเข้าใช้
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
                เกิดข้อผิดพลาดในการเข้าสู่ระบบ
              </AlertTitle>
              <Typography variant="subtitle1">{errorMsg}</Typography>
              {errorMsg === 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง' && (
                <Typography variant="subtitle1">
                  คุณยังไม่มีบัญชีใช่ไหม? —
                  <Link href="sign-up" passHref>
                    <MuiLink className="px-1 font-bold">
                      เริ่มต้นสร้างบัญชี
                    </MuiLink>
                  </Link>
                  🚀
                </Typography>
              )}
            </Alert>
          </Collapse>
          <SignInForm onSubmit={onSubmit} />
          <Typography className="mt-2" variant="subtitle2" align="right">
            <Link href="forgot-password" passHref>
              <MuiLink>ลืมรหัสผ่าน</MuiLink>
            </Link>
          </Typography>
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

export default SignIn;

SignIn.getLayout = (page) => {
  return <PrimaryLayout title="ลงชื่อเข้าใช้">{page}</PrimaryLayout>;
};

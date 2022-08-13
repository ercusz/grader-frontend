import { Alert, AlertTitle, Button, Collapse, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PrimaryLayout from '../../components/layouts/primary/PrimaryLayout';
import SignUpForm from '../../components/sign-up-form/SignUpForm';
import { signUp } from '../../utils/auth';
import { NextPageWithLayout } from '../page';

const SignUp: NextPageWithLayout = () => {
  const router = useRouter();

  const [openAlert, setOpenAlert] = useState(false);

  const onSubmit = async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const res = await signUp({
        email: data.email,
        username: data.username,
        password: data.password,
      });

      router.replace('/auth/sign-in');
    }
    catch(error){
      setOpenAlert(true);
    }
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
            backgroundImage: 'url(/sign-up.jpg)',
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
            สร้างบัญชี
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
                เกิดข้อผิดพลาดในการสร้างบัญชี!
              </AlertTitle>
              กรุณาลองใหม่อีกครั้งในภายหลัง
            </Alert>
          </Collapse>
          <SignUpForm onSubmit={onSubmit} />
          <Divider sx={{ mt: 4, mb: 2 }}>มีบัญชีแล้ว?</Divider>
          <Link href="sign-in" passHref>
            <Button fullWidth variant="outlined" color="primary">
              ลงชื่อเข้าใช้
            </Button>
          </Link>
        </Grid>
      </Grid>
    </section>
  );
};

export default SignUp;

SignUp.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

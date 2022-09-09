import { Button, Grid, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { LottiePlayer } from 'lottie-web';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Maintain: NextPageWithLayout = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/maintain.json',
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  return (
    <section>
      <Grid
        container
        className="min-h-screen"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={16} sm={16} md={5}>
          <Box>
            <Container maxWidth="sm">
              <Typography
                className="font-bold"
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                ขออภัย
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                ขณะนี้ระบบอยู่ในระหว่างการปิดปรับปรุง
              </Typography>
              <Typography
                className="font-light"
                variant="h6"
                align="center"
                color="text.secondary"
                paragraph
              >
                กรุณาลองใหม่อีกครั้งในภายหลัง
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Link href="/">
                  <Button variant="outlined">กลับไปยังหน้าหลัก</Button>
                </Link>
              </Stack>
            </Container>
          </Box>
        </Grid>

        <Grid
          item
          xs={false}
          sm={false}
          md={7}
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block' },
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <div ref={ref} />
        </Grid>
      </Grid>
    </section>
  );
};

export default Maintain;

Maintain.getLayout = (page) => {
  return <PrimaryLayout title="ปิดปรับปรุง">{page}</PrimaryLayout>;
};

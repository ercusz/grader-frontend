import { Button, Grid, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { LottiePlayer } from 'lottie-web';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  const { data: session } = useSession();
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
        path: '/programmer-guy.json',
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
        <Grid item xs={16} sm={16} md={6}>
          <Box className="lg:scale-125">
            <Container maxWidth="sm">
              <Typography
                className="font-bold"
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                grade้r
              </Typography>
              <Typography
                className="mt-4"
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                &ldquo;เกรดเด้อ&rdquo;
              </Typography>
              {session && (
                <Stack
                  sx={{ pt: 4 }}
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                >
                  <Link href="/classroom">
                    <Button variant="contained">คลาสเรียนของฉัน</Button>
                  </Link>
                  <Link href="/playground">
                    <Button variant="outlined">เพลย์กราวด์</Button>
                  </Link>
                </Stack>
              )}
            </Container>
          </Box>
        </Grid>

        <Grid
          item
          xs={false}
          sm={false}
          md={6}
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

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

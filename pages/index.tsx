import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NextPageWithLayout } from './page';

const LazyLottiePlayer = dynamic(
  () => import('@/components/media-players/lottie/LottiePlayer'),
  {
    ssr: false,
  }
);

const Home: NextPageWithLayout = () => {
  const { data: session } = useSession();

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
          <LazyLottiePlayer
            src="/programmer-guy.json"
            renderer="svg"
            loop
            autoplay
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

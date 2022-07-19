import { Button, Grid, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React, { useRef } from 'react';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  const ref = useRef(null);
  React.useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  return (
    <section>
      {/* Hero unit */}
      <Grid container>
        <Grid item xs={16} sm={16} md={6}>
          <Box
            className="lg:scale-125"
            sx={{
              pt: 10,
            }}
          >
            <Container maxWidth="sm">
              <Typography
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
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                <Button variant="contained">คลาสเรียนของฉัน</Button>
                <Button variant="outlined">จัดการคลาสเรียน</Button>
              </Stack>
            </Container>
          </Box>
        </Grid>

        <Grid
          className="scale-110 lg:scale-125"
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
          <lottie-player
            id="firstLottie"
            ref={ref}
            autoplay
            loop
            mode="normal"
            src="/programmer-guy.json"
          ></lottie-player>
        </Grid>
      </Grid>
    </section>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

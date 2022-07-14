import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <main className="flex flex-col items-center gap-y-5 mt-6">
      {/* Hero unit */}
      <Grid container sx={{ height: '100vh' }}>
        <Grid item xs={16} sm={16} md={6}>
          <Box
            className="lg:scale-125"
            sx={{
              bgcolor: 'background.paper',
              pt: 20,
              pb: 6,
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
          className="scale-90"
          item
          xs={false}
          sm={false}
          md={6}
          sx={{
            backgroundImage: 'url(/home.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></Grid>
      </Grid>

      <Container sx={{ py: 8 }} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    // 16:9
                    pt: '56.25%',
                  }}
                  image="https://source.unsplash.com/random"
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Heading
                  </Typography>
                  <Typography>
                    This is a media card. You can use this section to describe
                    the content.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View</Button>
                  <Button size="small">Edit</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

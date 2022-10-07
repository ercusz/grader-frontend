import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PushPinIcon from '@mui/icons-material/PushPin';
import {
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  List,
  ListItem,
} from '@mui/material';
import { EffectCreative, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { Swiper, SwiperSlide } from 'swiper/react';
import PostCard from '../../cards/post-card/PostCard';

export interface IPinList {}

const PinList: React.FC<IPinList> = () => {
  return (
    <List>
      <ListItem disableGutters>
        <Card variant="outlined">
          <CardHeader
            sx={{
              display: 'flex',
              overflow: 'hidden',
              '& .MuiCardHeader-content': {
                overflow: 'hidden',
              },
            }}
            avatar={<PushPinIcon />}
            title="โพสต์ปักหมุด"
            action={
              <ButtonGroup size="large" disableElevation>
                <IconButton className="prevBtn">
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton className="nextBtn">
                  <NavigateNextIcon />
                </IconButton>
              </ButtonGroup>
            }
          />
          <CardContent sx={{ p: 0 }}>
            <Swiper
              className="pinList-swiper"
              modules={[Navigation, EffectCreative]}
              grabCursor={true}
              effect={'creative'}
              rewind={true}
              navigation={{
                prevEl: '.prevBtn',
                nextEl: '.nextBtn',
              }}
              creativeEffect={{
                prev: {
                  opacity: 0.4,
                  shadow: false,
                  translate: ['-70%', 0, -500],
                },
                next: {
                  opacity: 0.4,
                  shadow: false,
                  translate: ['70%', 0, -500],
                },
              }}
            >
              {[...Array(4)].map((_, idx) => (
                <SwiperSlide key={idx}>
                  <Container
                    sx={{ p: 2 }}
                    className="shadow-lg"
                    id="post-card-container"
                  >
                    <PostCard compact />
                  </Container>
                </SwiperSlide>
              ))}
            </Swiper>
          </CardContent>
        </Card>
      </ListItem>
    </List>
  );
};

export default PinList;

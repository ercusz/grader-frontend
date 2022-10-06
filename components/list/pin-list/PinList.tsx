import PushPinIcon from '@mui/icons-material/PushPin';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  List,
  ListItem,
} from '@mui/material';
import { EffectCreative } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { Swiper, SwiperSlide } from 'swiper/react';
import PostCard from '../../cards/post-card/PostCard';

export interface IPinList {}

const PinList: React.FC<IPinList> = () => {
  return (
    <List>
      <ListItem>
        <Card>
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
          />
          <CardContent sx={{ p: 0 }}>
            <Swiper
              grabCursor={true}
              effect={'creative'}
              creativeEffect={{
                prev: {
                  shadow: false,
                  translate: ['-100%', 0, -500],
                },
                next: {
                  shadow: false,
                  translate: ['100%', 0, -500],
                },
              }}
              modules={[EffectCreative]}
              className="mySwiper2"
            >
              {[...Array(4)].map((_, idx) => (
                <SwiperSlide key={idx}>
                  <Container sx={{ p: 2 }} className="shadow-lg">
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

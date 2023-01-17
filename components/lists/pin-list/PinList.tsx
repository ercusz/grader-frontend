import PostCard from '@/components/cards/post-card/PostCard';
import { Post } from '@/types/types';
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
  Typography,
} from '@mui/material';
import { EffectCreative, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { Swiper, SwiperSlide } from 'swiper/react';
export interface IPinList {
  posts: Post[];
  classroomSlug: string;
}

const PinList: React.FC<IPinList> = ({ posts, classroomSlug }) => {
  return (
    <List>
      <ListItem disableGutters>
        <Card className="w-full" variant="outlined">
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
              posts &&
              posts.length > 1 && (
                <ButtonGroup size="large" disableElevation>
                  <IconButton className="prevBtn">
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton className="nextBtn">
                    <NavigateNextIcon />
                  </IconButton>
                </ButtonGroup>
              )
            }
          />
          <CardContent sx={{ p: 0 }}>
            {posts && posts.length === 0 && (
              <Typography
                className="text-center"
                variant="h6"
                color="textSecondary"
              >
                ไม่พบโพสต์ปักหมุด
              </Typography>
            )}
            {posts && posts.length > 0 && (
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
                {posts.map((post) => (
                  <SwiperSlide key={post.id}>
                    <Container
                      sx={{ p: 2 }}
                      className="shadow-lg"
                      id="post-card-container"
                    >
                      <PostCard
                        compact
                        post={post}
                        classroomSlug={classroomSlug}
                      />
                    </Container>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </CardContent>
        </Card>
      </ListItem>
    </List>
  );
};

export default PinList;

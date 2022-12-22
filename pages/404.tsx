import PrimaryLayout from '@/components/layouts/primary/PrimaryLayout';
import { Button, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NextPageWithLayout } from './page';

const LazyLottiePlayer = dynamic(
  () => import('@/components/media-players/lottie/LottiePlayer'),
  {
    ssr: false,
  }
);

const NotFound: NextPageWithLayout = () => {
  return (
    <section className="h-screen pt-20 pb-32 text-center">
      <LazyLottiePlayer
        className="h-full"
        src="/404.json"
        renderer="svg"
        loop
        autoplay
      />
      <Typography className="font-bold" variant="h5" gutterBottom>
        ไม่พบหน้าที่คุณกำลังตามหา
      </Typography>
      <Link href="/">
        <Button className="mb-4" variant="outlined" size="small">
          กลับไปยังหน้าหลัก
        </Button>
      </Link>
    </section>
  );
};

export default NotFound;

NotFound.getLayout = (page) => {
  return <PrimaryLayout title="Page not found">{page}</PrimaryLayout>;
};

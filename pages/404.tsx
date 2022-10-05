import { Button, Typography } from '@mui/material';
import type { LottiePlayer } from 'lottie-web';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const NotFound: NextPageWithLayout = () => {
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
        path: '/404.json',
      });

      return () => animation.destroy();
    }
  }, [lottie]);

  return (
    <section className="h-screen pt-20 pb-32 text-center">
      <div className="h-full" ref={ref} />
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

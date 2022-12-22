import * as Player from '@lottiefiles/lottie-player';
import { useEffect, useRef } from 'react';

type LottiePlayerProps = InstanceType<typeof Player.LottiePlayer>;

export interface ILottiePlayer extends Partial<LottiePlayerProps> {
  src: string;
}

const LottiePlayer: React.FC<ILottiePlayer> = ({ src, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('@lottiefiles/lottie-player');
  });

  return <lottie-player ref={ref} src={src} {...props} />;
};

export default LottiePlayer;

/* eslint-disable no-undef */
import RateReviewIcon from '@mui/icons-material/RateReview';
import { Fab } from '@mui/material';
import Script from 'next/script';

export interface ITallyFormButton {}

type PopupOptions = {
  key?: string;
  layout?: 'default' | 'modal';
  width?: number;
  alignLeft?: boolean;
  hideTitle?: boolean;
  overlay?: boolean;
  emoji?: {
    text: string;
    animation:
      | 'none'
      | 'wave'
      | 'tada'
      | 'heart-beat'
      | 'spin'
      | 'flash'
      | 'bounce'
      | 'rubber-band'
      | 'head-shake';
  };
  autoClose?: number;
  showOnce?: boolean;
  doNotShowAfterSubmit?: boolean;
  customFormUrl?: string;
  hiddenFields?: {
    [key: string]: any;
  };
  onOpen?: () => void;
  onClose?: () => void;
  onPageView?: (page: number) => void;
  onSubmit?: (payload: any) => void;
};

const TallyFormButton: React.FC<ITallyFormButton> = () => {
  const formId = '3jZ7gR';

  const tallyOptions: PopupOptions = {
    layout: 'default',
    hideTitle: true,
    overlay: true,
    emoji: {
      text: '👋',
      animation: 'wave',
    },
  };

  return (
    <>
      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-ignore
          Tally.loadEmbeds();
          // @ts-ignore
          Tally.openPopup(formId, {
            ...tallyOptions,
            doNotShowAfterSubmit: true,
            showOnce: true,
          });
        }}
      />
      <Fab
        variant="extended"
        color="primary"
        // @ts-ignore
        onClick={() => Tally.openPopup(formId, tallyOptions)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <RateReviewIcon sx={{ mr: 1 }} />
        ทำแบบสอบถาม
      </Fab>
    </>
  );
};

export default TallyFormButton;

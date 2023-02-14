import FeedbackHeader, {
  FeedbackHeaderProps,
} from '@/components/headers/feedback/FeedbackHeader';
import { Container } from '@mui/material';
import Head from 'next/head';
import { Suspense } from 'react';

export interface IFeedbackLayout extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  description?: string;
  classroomSlug?: string;
  backButton?: boolean;
  feedbackHeaderProps: FeedbackHeaderProps;
}

const FeedbackLayout: React.FC<IFeedbackLayout> = ({
  children,
  title,
  description = 'grade้r — helps you improve your coding skills.',
  classroomSlug,
  feedbackHeaderProps,
}) => {
  return (
    <>
      <Head>
        <title>{title ? title + ' - grade้r' : 'grade้r'}</title>
        <meta name="description" content={description} />
      </Head>
      <div className={`min-h-screen flex flex-col`}>
        <FeedbackHeader
          classroomSlug={classroomSlug}
          props={feedbackHeaderProps}
        />
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 3, md: 4 },
            py: 4,
          }}
        >
          <Suspense fallback={'Loading...'}>{children}</Suspense>
        </Container>
      </div>
    </>
  );
};

export default FeedbackLayout;

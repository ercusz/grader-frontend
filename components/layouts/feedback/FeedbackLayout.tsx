import StudentSubmissionsDrawer from '@/components/drawers/student-submissions/StudentSubmissionsDrawer';
import FeedbackSubHeader from '@/components/headers/feedback-sub/FeedbackSubHeader';
import FeedbackHeader, {
  FeedbackHeaderProps,
} from '@/components/headers/feedback/FeedbackHeader';
import { Box, Container, Toolbar } from '@mui/material';
import Head from 'next/head';
import { Suspense } from 'react';

export type contentProps = {
  subHeader: boolean;
  sidebar: boolean;
};

export interface IFeedbackLayout extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  description?: string;
  classroomSlug?: string;
  backButton?: boolean;
  feedbackHeaderProps: FeedbackHeaderProps;
  contentProps: contentProps;
}

const FeedbackLayout: React.FC<IFeedbackLayout> = ({
  children,
  title,
  description = 'grade้r — helps you improve your coding skills.',
  classroomSlug,
  feedbackHeaderProps,
  contentProps,
}) => {
  const { subHeader, sidebar } = contentProps;

  return (
    <>
      <Head>
        <title>{title ? title + ' - grade้r' : 'grade้r'}</title>
        <meta name="description" content={description} />
      </Head>
      <Box sx={{ display: 'flex' }}>
        <FeedbackHeader
          classroomSlug={classroomSlug}
          props={feedbackHeaderProps}
          subHeader={subHeader ? <FeedbackSubHeader /> : null}
        />
        {sidebar && <StudentSubmissionsDrawer />}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: 'background.paper',
            minHeight: '100vh',
          }}
        >
          {subHeader && (
            <>
              <Toolbar />
              <Toolbar />
            </>
          )}
          <Toolbar />
          <Container maxWidth="lg">
            <Suspense fallback={'Loading...'}>{children}</Suspense>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default FeedbackLayout;

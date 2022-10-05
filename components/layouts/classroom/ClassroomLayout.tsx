import Container from '@mui/material/Container';
import Head from 'next/head';
import { Suspense } from 'react';
import CourseHeader from '../../header/course-header/CourseHeader';
import ClassroomMenu from '../../menu/classroom-menu/ClassroomMenu';
import Header from '../../navigation/header/Header';

export interface IClassroomLayout
  extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  description?: string;
}

const ClassroomLayout: React.FC<IClassroomLayout> = ({
  children,
  title,
  description = 'grade้r — helps you improve your coding skills.',
}) => {
  return (
    <>
      <Head>
        <title>{title ? title + ' - grade้r' : 'grade้r'}</title>
        <meta name="description" content={description} />
      </Head>
      <div className={`min-h-screen flex flex-col`}>
        <Header />
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 3, md: 4 },
            pb: 1,
          }}
        >
          <Suspense fallback={'Loading...'}>
            <CourseHeader />
            <ClassroomMenu />
            {children}
          </Suspense>
        </Container>
      </div>
    </>
  );
};

export default ClassroomLayout;

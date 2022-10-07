import Container from '@mui/material/Container';
import Head from 'next/head';
import { Suspense } from 'react';
import Header from '../../navigations/header/Header';

export interface IPrimaryLayout extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  description?: string;
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({
  children,
  title,
  description = 'grade้r — helps you improve your coding skills.',
  ...divProps
}) => {
  return (
    <>
      <Head>
        <title>{title ? title + ' - grade้r' : 'grade้r'}</title>
        <meta name="description" content={description} />
      </Head>
      <div {...divProps} className={`min-h-screen flex flex-col`}>
        <Header />
        <Suspense fallback={'Loading...'}>
          <Container className="min-w-full p-0 m-0">{children}</Container>
        </Suspense>
      </div>
    </>
  );
};

export default PrimaryLayout;

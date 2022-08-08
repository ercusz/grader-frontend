import Container from '@mui/material/Container';
import Head from 'next/head';
import Header from '../../navigation/header/Header';

export interface IPrimaryLayout extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start';
}

const PrimaryLayout: React.FC<IPrimaryLayout> = ({
  children,
  justify = 'items-center',
  ...divProps
}) => {
  return (
    <>
      <Head>
        <title>grade้r</title>
      </Head>
      <div {...divProps} className={`min-h-screen flex flex-col ${justify}`}>
        <Header />
        <Container className="min-w-full p-0 m-0">{children}</Container>
        <div className="m-auto" />
      </div>
    </>
  );
};

export default PrimaryLayout;

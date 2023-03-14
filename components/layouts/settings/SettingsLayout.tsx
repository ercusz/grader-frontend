import SettingsTabs from '@/components/tabs/setttings/SettingsTabs';
import { Container, Divider, Grid, Toolbar, Typography } from '@mui/material';
import Head from 'next/head';
import Header from '../../navigations/header/Header';

export interface ISettingsLayout extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  description?: string;
}

const SettingsLayout: React.FC<ISettingsLayout> = ({
  children,
  title,
  description = 'grade้r — helps you improve your coding skills.',
}) => {
  return (
    <>
      <Head>
        <title>{title ? title + ' - การตั้งค่า | grade้r' : 'grade้r'}</title>
        <meta name="description" content={description} />
      </Head>
      <Container>
        <Header />
        <Toolbar />
        <Toolbar />

        {/* Page */}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={4}
          sx={{
            px: 2,
          }}
        >
          {/* Page Header */}
          <Grid item xs={12}>
            <Typography variant="h4" component="h1">
              การตั้งค่า
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              จัดการข้อมูลบัญชีของคุณ
            </Typography>

            <Divider
              sx={{
                my: 2,
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            sx={{
              pr: 4,
            }}
          >
            <SettingsTabs />
          </Grid>

          {/* Content */}
          <Grid item xs={12} sm={12} md={9}>
            {children}
          </Grid>
        </Grid>
        <Toolbar />
      </Container>
    </>
  );
};

export default SettingsLayout;

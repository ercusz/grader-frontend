import HeaderlessLayout from '@/components/layouts/headerless/HeaderlessLayout';
import { useUserProfile } from '@/hooks/user/useUser';
import { setToken } from '@/utils/APIHelper';
import { getImagePath } from '@/utils/imagePath';
import { getUserFullName, getUserProfileByUsername } from '@/utils/UserService';
import { Avatar, Box, Container, Link, Typography } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextPageWithLayout } from '../page';
// @ts-ignore
import { Gradient } from '@/utils/Gradient';

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mt: 2,
  color: 'black',
  bgcolor: 'white',
  mixBlendMode: 'screen',
  width: '100%',
  height: 50,
  borderRadius: 2,
  cursor: 'pointer',
  border: '2px solid white',
  fontWeight: 700,
  '&:hover': {
    transform: 'scale(1.05)',
    fontWeight: 900,
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
  },
  transition: 'all 0.2s ease-out',
};

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const { username } = router.query;

  const { data: userProfile } = useUserProfile({
    username: username ? username.toString() : '',
  });

  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
  }, []);

  return (
    <section>
      <canvas id="gradient-canvas" data-transition-in />
      {userProfile && (
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {/* User Profile Image */}
            <Avatar
              alt={`${userProfile.username}'s profile image`}
              src={getImagePath(userProfile.profileImage)}
              sx={{
                width: 100,
                height: 100,
                fontSize: 50,
                mb: 2,
              }}
            >
              {userProfile.firstName && userProfile.lastName
                ? userProfile.firstName?.charAt(0) +
                  userProfile.lastName?.charAt(0)
                : userProfile.username?.charAt(0)}
            </Avatar>

            {/* User Full Name */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              {getUserFullName(userProfile)}
            </Typography>

            {/* User Bio */}
            {userProfile.bio && (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                }}
              >
                {userProfile.bio}
              </Typography>
            )}

            {/* User Email */}
            {userProfile.contactEmail && (
              <Link
                href={`mailto:${userProfile.contactEmail}`}
                underline="none"
                sx={buttonStyle}
              >
                {userProfile.contactEmail}
              </Link>
            )}

            {/* User Phone Number */}
            {userProfile.phoneNumber && (
              <Link
                href={`tel:${userProfile.phoneNumber}`}
                underline="none"
                sx={buttonStyle}
              >
                {userProfile.phoneNumber
                  .replace(/\D+/g, '')
                  .replace(/(\d{2,3})(\d{3})(\d{4})/, '$1-$2-$3')}
              </Link>
            )}
          </Container>
        </Box>
      )}
    </section>
  );
};

export default Profile;

Profile.getLayout = (page) => {
  const { props } = page;
  const { title } = props;
  return <HeaderlessLayout title={title}>{page}</HeaderlessLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username }: any = context.params;
  const { req } = context;
  const token = await getToken({ req });

  if (token && token.jwt) {
    setToken(token.jwt);
  }

  const queryClient = new QueryClient();
  let title = 'ไม่พบผู้ใช้';

  try {
    const userProfile = await queryClient.fetchQuery(
      ['user-profile', { username: username }],
      () => getUserProfileByUsername(username)
    );

    const userProfileName = getUserFullName(userProfile);

    title = `โปรไฟล์ของ ${userProfileName}`;
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: title,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

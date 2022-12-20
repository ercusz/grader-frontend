import { setIsAuthenticated } from '@/hooks/user/useUser';
import { setToken } from '@/utils/APIHelper';
import { Backdrop, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

function SessionLoader({ children }: Props) {
  const { data, status } = useSession();

  if (status === 'loading') {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (status === 'authenticated') {
    setToken(data.jwt); // add authorization header for every requests from client
    setIsAuthenticated(true);
  }

  return <>{children}</>;
}

export default SessionLoader;

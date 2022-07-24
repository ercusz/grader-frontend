import LogoDevIcon from '@mui/icons-material/LogoDev';
import { Link as MuiLink } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export interface IBranding {
  withText?: boolean;
  large?: boolean
}

const Branding: React.FC<IBranding> = ({ withText = false, large = false }) => {
  return (
    <Link href="/" passHref>
      <MuiLink underline="none">
        <Stack direction="row" alignItems="center" justifyItems="center">
          <LogoDevIcon fontSize={large ? "large" : "medium"} sx={{ mr: 1 }} />
          {withText && (
            <Typography
              variant={large ? "h4" : "h6"}
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              grade้r
            </Typography>
          )}
        </Stack>
      </MuiLink>
    </Link>
  );
};

export default Branding;

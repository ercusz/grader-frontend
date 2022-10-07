import { Link as MuiLink, SvgIcon, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export interface IBranding {
  withText?: boolean;
  large?: boolean;
}

const Favicon = ({ fontSize, bg, text, sx }: any) => (
  <SvgIcon fontSize={fontSize} sx={sx}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill={bg} />
      <path
        fill={text}
        d="M20.68 53.59L20.68 59.18L4.47 48.68L4.47 44.39L20.68 33.89L20.68 39.48L9.55 46.45L9.55 46.62L20.68 53.59ZM33.07 67.20L27.91 67.20L41.73 30.66L46.89 30.66L33.07 67.20ZM61.63 69.34L61.63 69.34Q59.62 69.34 57.88 69.03Q56.13 68.71 54.87 68.06Q53.61 67.41 52.90 66.40Q52.18 65.39 52.18 64.01L52.18 64.01Q52.18 61.45 55.42 59.85L55.42 59.85L55.42 59.68Q54.54 59.13 53.93 58.30Q53.32 57.45 53.32 56.11L53.32 56.11Q53.32 55.06 54.01 54.01Q54.70 52.96 55.80 52.20L55.80 52.20L55.80 52.04Q54.66 51.28 53.86 49.92Q53.07 48.55 53.07 46.70L53.07 46.70Q53.07 44.81 53.80 43.41Q54.54 42.00 55.75 41.05Q56.97 40.11 58.59 39.63Q60.21 39.14 61.97 39.14L61.97 39.14Q63.90 39.14 65.41 39.65L65.41 39.65L73.86 39.65L73.86 44.18L69.66 44.18Q69.99 44.64 70.29 45.38Q70.58 46.11 70.58 46.91L70.58 46.91Q70.58 48.72 69.91 50.02Q69.24 51.32 68.08 52.18Q66.93 53.05 65.35 53.46Q63.78 53.88 61.97 53.88L61.97 53.88Q60.63 53.88 59.11 53.46L59.11 53.46Q58.65 53.80 58.42 54.14Q58.19 54.47 58.19 55.02L58.19 55.02Q58.19 55.86 59.03 56.22Q59.87 56.57 61.72 56.57L61.72 56.57L65.58 56.57Q69.70 56.57 71.86 57.79Q74.02 59.01 74.02 61.82L74.02 61.82Q74.02 63.46 73.14 64.85Q72.26 66.23 70.66 67.22Q69.07 68.21 66.76 68.77Q64.45 69.34 61.63 69.34ZM61.97 50.15L61.97 50.15Q63.27 50.15 64.20 49.29Q65.12 48.42 65.12 46.70L65.12 46.70Q65.12 45.06 64.20 44.18Q63.27 43.30 61.97 43.30L61.97 43.30Q60.67 43.30 59.77 44.18Q58.86 45.06 58.86 46.70L58.86 46.70Q58.86 48.42 59.77 49.29Q60.67 50.15 61.97 50.15ZM62.52 65.44L62.52 65.44Q65.04 65.44 66.59 64.72Q68.14 64.01 68.14 62.91L68.14 62.91Q68.14 61.91 67.22 61.61Q66.30 61.32 64.49 61.32L64.49 61.32L61.89 61.32Q60.75 61.32 60.02 61.26Q59.28 61.19 58.69 61.02L58.69 61.02Q57.90 61.53 57.56 62.01Q57.22 62.49 57.22 63.08L57.22 63.08Q57.22 64.26 58.63 64.85Q60.04 65.44 62.52 65.44ZM95.53 48.68L79.32 59.18L79.32 53.59L90.45 46.62L90.45 46.45L79.32 39.48L79.32 33.89L95.53 44.39L95.53 48.68Z"
      />
    </svg>
  </SvgIcon>
);

const Branding: React.FC<IBranding> = ({ withText = false, large = false }) => {
  const theme = useTheme();
  return (
    <Link href="/" passHref>
      <MuiLink underline="none">
        <Stack direction="row" alignItems="center" justifyItems="center">
          <Favicon
            bg={theme.palette.mode === 'dark' ? 'white' : 'black'}
            text={theme.palette.mode === 'dark' ? 'black' : 'white'}
            fontSize={large ? 'large' : 'medium'}
          />
          {withText && (
            <Typography
              variant={large ? 'h4' : 'h6'}
              noWrap
              sx={{
                mx: 1,
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

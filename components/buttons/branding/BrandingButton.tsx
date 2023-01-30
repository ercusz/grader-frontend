import GraderIcon, { IGraderIcon } from '@/components/icons/grader/GraderIcon';
import { Link as MuiLink, Stack, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

export interface IBrandingButton {
  withText?: boolean;
  large?: boolean;
  iconBgColor?: string;
  iconTextColor?: string;
}

const BrandingButton: React.FC<IBrandingButton> = ({
  withText = false,
  large = false,
  iconBgColor,
  iconTextColor,
}) => {
  const theme = useTheme();

  const graderIconProps: IGraderIcon = {
    bgColor: iconBgColor
      ? iconBgColor
      : theme.palette.mode === 'dark'
      ? 'white'
      : 'black',
    textColor: iconTextColor
      ? iconTextColor
      : theme.palette.mode === 'dark'
      ? 'black'
      : 'white',
    fontSize: large ? 'large' : 'medium',
  };

  return (
    <Link href="/" passHref>
      <MuiLink underline="none">
        <Stack direction="row" alignItems="center" justifyItems="center">
          <GraderIcon {...graderIconProps} />
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

export default BrandingButton;

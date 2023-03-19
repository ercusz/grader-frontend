import { Avatar, IconButton, Theme } from '@mui/material';

export interface IOutlinedAvatar {
  alt?: string;
  src?: string;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const OutlinedAvatar: React.FC<IOutlinedAvatar> = ({
  alt,
  src,
  size,
  clickable,
  children,
  onClick,
}) => {
  const renderSize = () => {
    if (size === 'small') {
      return {
        width: 16,
        height: 16,
        fontSize: '0.5rem',
        lineHeight: '0.75rem',
      };
    } else if (size === 'large') {
      return {
        width: 48,
        height: 48,
        fontSize: '1.5rem',
        lineHeight: '2rem',
      };
    }

    return {
      width: 28,
      height: 28,
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    };
  };

  return (
    <IconButton
      className={`drop-shadow-2xl 
      ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
      sx={{
        p: 0.3,
        background: (theme) => `linear-gradient(${
          theme.palette.background.default
        }, ${theme.palette.background.default}) padding-box,
          ${
            !src
              ? 'radial-gradient(ellipse at top,rgb(180, 83, 9),rgb(253, 186, 116),rgb(159, 18, 57))'
              : `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.main})` +
                ' border-box'
          }`,
        border: '3px solid transparent',
        '&:hover': {
          p: 0.2,
          borderWidth: '2px',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={onClick}
      disableRipple={!clickable}
    >
      <Avatar
        className={`${
          !src &&
          'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800'
        }`}
        alt={alt}
        src={src}
        sx={
          {
            fontWeight: 900,
            color: (theme: Theme) => theme.palette.background.default,
          } && renderSize()
        }
      >
        {children}
      </Avatar>
    </IconButton>
  );
};

export default OutlinedAvatar;

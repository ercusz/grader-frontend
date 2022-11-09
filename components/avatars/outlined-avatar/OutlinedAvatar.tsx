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
      ${
        !src &&
        'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800'
      }
      ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
      sx={{
        bgcolor: (theme: Theme) => theme.palette.primary.main + '!important',
        color: (theme: Theme) => theme.palette.background.default,
      }}
      onClick={onClick}
      disableRipple={!clickable}
    >
      <Avatar
        className={`outline outline-offset-4 bg-transparent font-black 
        ${clickable ? 'transition-all hover:outline-offset-2' : ''}`}
        alt={alt}
        src={src}
        sx={
          {
            outlineColor: (theme: Theme) => theme.palette.background.default,
          } && renderSize()
        }
      >
        {children}
      </Avatar>
    </IconButton>
  );
};

export default OutlinedAvatar;

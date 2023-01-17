import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
} from '@mui/material';

export interface IPostCardSkeleton {}

const PostCardSkeleton: React.FC<IPostCardSkeleton> = () => {
  return (
    <Card className="shadow-md w-full" variant="outlined">
      <CardHeader
        sx={{
          display: 'flex',
          overflow: 'hidden',
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" sx={{ fontSize: '1rem' }} />}
        subheader={<Skeleton variant="text" sx={{ fontSize: '1rem' }} />}
      />
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      </CardContent>
      <CardActions>
        <CardActions sx={{ width: '100%', justifyContent: 'space-around' }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="rounded" width="80%" height={36} />
          <Skeleton variant="rounded" width={64} height={36} />
        </CardActions>
      </CardActions>
    </Card>
  );
};

export default PostCardSkeleton;

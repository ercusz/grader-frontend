import {
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  Skeleton,
} from '@mui/material';

export interface IAssignmentCardSkeleton {}

const AssignmentCardSkeleton: React.FC<IAssignmentCardSkeleton> = () => {
  return (
    <Card className="shadow-md w-full" variant="outlined">
      <CardActionArea>
        <CardHeader
          sx={{
            display: 'flex',
            overflow: 'hidden',
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            },
          }}
          avatar={<Skeleton variant="circular" width={40} height={40} />}
          title={
            <Skeleton variant="text" width="60%" sx={{ fontSize: '1.5rem' }} />
          }
          subheader={
            <Skeleton variant="text" width="30%" sx={{ fontSize: '0.8rem' }} />
          }
        />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Skeleton variant="text" width="5%" sx={{ fontSize: '1rem' }} />
          <Skeleton variant="text" width="8%" sx={{ fontSize: '1.5rem' }} />
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

export default AssignmentCardSkeleton;

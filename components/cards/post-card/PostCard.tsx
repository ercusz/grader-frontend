import Face from '@mui/icons-material/Face';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MouseEvent } from 'react';

export interface IPostCard {

}

const PostCard: React.FC<IPostCard> = () => {
  const handleMoreButtonClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

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
        avatar={
          <Avatar aria-label="user-avatar">
            <Face fontSize="inherit" />
          </Avatar>
        }
        action={
          <IconButton
            onTouchStart={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(e) => {
              handleMoreButtonClick(e);
            }}
            aria-label="more"
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography noWrap variant="subtitle2">
            John Doe
          </Typography>
        }
        subheader={
          <Stack
            direction="row"
            divider={<Typography variant="caption">·</Typography>}
            alignItems="center"
            spacing={1}
          >
            <Chip
              className="font-semibold"
              size="small"
              color={'secondary'}
              label={'Teacher'}
              sx={{
                borderRadius: '4px',
                '& .MuiChip-label': { fontSize: 10, p: 0.6 },
              }}
            />
            <Typography noWrap variant="caption">
              September 14, 2016
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        <Typography variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
          {`Lizards are a widespread group of squamate reptiles, with over 6,000
              species, ranging across all continents except Antarctica.
              
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est commodi qui consequatur nisi eum magnam recusandae impedit aliquid voluptas, voluptatibus officiis labore voluptatum necessitatibus assumenda esse magni! Optio, laudantium eum.`}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 3 }}>
        <IconButton size="small" sx={{ ml: -1 }}>
          <Face />
        </IconButton>
        <TextField
          size="small"
          placeholder="Add a comment…"
          sx={{ flexGrow: 1, mr: 1, '& fieldset': { border: 'none' } }}
        />
        <Button disabled variant="text">
          Post
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostCard;

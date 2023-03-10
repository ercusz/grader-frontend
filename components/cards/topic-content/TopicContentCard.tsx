import { Topic } from '@/types/types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import SubtaskCard from '../subtask/SubtaskCard';

export interface ITopicContentCard {
  topic: Topic;
  classroomSlug?: string;
  isTeacherTA?: boolean;
}

const TopicContentCard: React.FC<ITopicContentCard> = ({
  topic,
  classroomSlug,
  isTeacherTA,
}) => {
  return (
    <>
      <Card
        className="shadow-xl w-full"
        variant="outlined"
        sx={{ px: 2, py: 4 }}
      >
        <CardHeader sx={{ py: 0 }} />
        <CardContent className="w-full">
          <Box sx={{ my: 4 }}>
            <Typography
              className="font-extrabold text-center"
              component="h1"
              variant="h4"
              gutterBottom
            >
              {topic.name}
            </Typography>
            <Divider sx={{ my: 6 }} />
          </Box>

          <Grid
            container
            columnSpacing={2}
            rowSpacing={2}
            justifyContent="space-around"
            alignItems="stretch"
          >
            {classroomSlug &&
              topic.assignments &&
              topic.assignments.map((assignment) => (
                <Grid item xs={12} sm={12} md={6} key={assignment.id}>
                  <SubtaskCard
                    key={assignment.id}
                    classroomSlug={classroomSlug}
                    assignment={assignment}
                    isTeacherTA={Boolean(isTeacherTA)}
                  />
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default TopicContentCard;

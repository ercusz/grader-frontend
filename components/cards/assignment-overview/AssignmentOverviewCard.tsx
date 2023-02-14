import { AssignmentOverview } from '@/types/types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Link from 'next/link';

export interface IAssignmentOverviewCard {
  assignment: AssignmentOverview;
  classroomSlug: string;
}

const AssignmentOverviewCard: React.FC<IAssignmentOverviewCard> = ({
  assignment,
  classroomSlug,
}) => {
  return (
    <Card
      variant="outlined"
      className="shadow-md"
      sx={{
        mb: 2,
        '&:last-child': {
          mb: 0,
        },
      }}
    >
      <Link
        href={`/classroom/${classroomSlug}/assignments/${assignment.id}/submissions`}
        passHref
      >
        <CardActionArea
          component="a"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            p: 1,
          }}
        >
          <CardHeader
            title={
              <>
                {assignment.type === 'java-src' && (
                  <Tooltip title="ซอร์สโค้ด" arrow>
                    <Avatar className="shadow-md bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-500 via-red-500 to-yellow-500">
                      <CodeIcon />
                    </Avatar>
                  </Tooltip>
                )}
                {assignment.type === 'docs' && (
                  <Tooltip title="เอกสาร" arrow>
                    <Avatar className="shadow-md bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900">
                      <AssignmentIcon />
                    </Avatar>
                  </Tooltip>
                )}
              </>
            }
          />
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              <Typography variant="h6" color="primary" noWrap>
                {assignment.title}
              </Typography>
              {assignment.topic && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {assignment.topic.name}
                </Typography>
              )}
            </CardContent>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 0 }}>
            <CardContent
              sx={{
                display: 'flex',
              }}
            >
              <Stack direction="row" spacing={6}>
                <Stack direction="column">
                  <Typography variant="h4">
                    {assignment.totalSubmitted}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    ส่งแล้ว
                  </Typography>
                </Stack>
                <Stack direction="column">
                  <Typography variant="h4">{assignment.totalGraded}</Typography>
                  <Typography variant="body2" noWrap>
                    ตรวจแล้ว
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Box>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default AssignmentOverviewCard;

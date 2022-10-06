import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { useLessonFilters } from '../../../state/classrooms/useLessonFilters';

export interface ILessonFiltersList {}

const LessonFiltersList: React.FC<ILessonFiltersList> = () => {
  const { lessons, setLessons, isFilterAll, isUnFilterAll, setFilterAll } =
    useLessonFilters();

  return (
    <List
      dense
      sx={{ width: '100%' }}
      subheader={
        <ListSubheader component="div" sx={{ bgcolor: 'transparent' }}>
          บทเรียน
        </ListSubheader>
      }
    >
      <ListItem disablePadding>
        <ListItemButton onClick={setFilterAll}>
          <ListItemIcon>
            <FormControlLabel
              label="ทั้งหมด"
              control={
                <Checkbox
                  checked={isFilterAll && !isUnFilterAll}
                  indeterminate={!isFilterAll && !isUnFilterAll}
                />
              }
            />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      {lessons?.map((lesson) => (
        <ListItem key={lesson.num} disablePadding>
          <ListItemButton onClick={() => setLessons(lesson)}>
            <ListItemIcon>
              <Checkbox checked={lesson.checked} />
            </ListItemIcon>
            <ListItemText primary={lesson.name} />
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText inset primary="เพิ่มเติม" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default LessonFiltersList;

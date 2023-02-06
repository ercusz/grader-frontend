import CreateTopicDialog from '@/components/dialogs/create-topic/CreateTopicDialog';
import { useTopics } from '@/hooks/topic/useTopic';
import { openCreateTopicDialogAtom } from '@/stores/create-topic';
import { Classroom, PostTo } from '@/types/types';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { atom, PrimitiveAtom, useAtom } from 'jotai';

export interface ITopicAutoComplete {
  classroom: Classroom;
  postToAtom: PrimitiveAtom<PostTo[]>;
}

const TopicAutoComplete: React.FC<ITopicAutoComplete> = ({
  classroom,
  postToAtom,
}) => {
  const { data: topics, isLoading } = useTopics({
    classroomId: classroom?.id.toString() as string,
  });

  const [postTo, setSelectedTopic] = useAtom(postToAtom);

  return (
    <Autocomplete
      value={postTo.find((p) => p.classroom.id === classroom.id)?.topic || null}
      loading={isLoading}
      options={topics || []}
      getOptionLabel={(topic) => topic.name}
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, value) =>
        setSelectedTopic((prev) =>
          prev.map((p) =>
            p.classroom.id === classroom.id ? { ...p, topic: value } : p
          )
        )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={`หัวข้อ (${classroom?.name})`}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export interface ITopicForm {
  postToAtom: PrimitiveAtom<PostTo[]>;
}

export const classroomAtom = atom<Classroom | null>(null);

const TopicForm: React.FC<ITopicForm> = ({ postToAtom }) => {
  const [, setOpenCreateTopicDialog] = useAtom(openCreateTopicDialogAtom);
  const [postTo] = useAtom(postToAtom);
  const [, setClassroom] = useAtom(classroomAtom);

  return (
    <>
      <CreateTopicDialog />
      <FormControl
        error={postTo.length === 0}
        component="fieldset"
        variant="standard"
      >
        {postTo.map(({ classroom }) => (
          <Box key={classroom.id} sx={{ mb: 2 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <FormLabel>{classroom.name}</FormLabel>
              <Tooltip title="สร้างหัวข้อใหม่">
                <IconButton
                  aria-label="add-topic"
                  onClick={() => {
                    setClassroom(classroom);
                    setOpenCreateTopicDialog(true);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <TopicAutoComplete classroom={classroom} postToAtom={postToAtom} />
          </Box>
        ))}
      </FormControl>
    </>
  );
};

export default TopicForm;

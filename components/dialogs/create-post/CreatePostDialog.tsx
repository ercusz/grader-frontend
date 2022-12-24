import { useCourseSlug } from '@/hooks/courses/useCourses';
import { openCreatePostDialogAtom } from '@/stores/create-post';
import { Classroom } from '@/types/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ICreatePostDialog {
  classroomSlug?: string;
  courseSlug?: string;
}

const tabsValueAtom = atom('post');
export const unsavedChangesAtom = atom(false);
export const postToAtom = atom<Classroom[]>([]);

const CreatePostDialog: React.FC<ICreatePostDialog> = ({
  classroomSlug,
  courseSlug,
}) => {
  const [openDialog, setOpenDialog] = useAtom(openCreatePostDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [postTo, setPostTo] = useAtom(postToAtom);
  const { data: course } = useCourseSlug({ slug: courseSlug });

  useEffect(() => {
    if (openDialog && course) {
      let classroom = course.classrooms.find(
        (classroom) => classroom.slug === classroomSlug
      );
      if (classroom) {
        setPostTo([classroom]);
      }
    }
  }, [openDialog, classroomSlug, course, setPostTo]);

  const postFormContext = useForm({ defaultValues: { message: '' } });

  const { handleSubmit, register, formState, reset } = postFormContext;
  const { isDirty } = formState;

  const onSubmit = () => {
    const obj = {
      courseId: course?.id,
      classroomIds: postTo.map((classroom) => classroom.id),
      message: postFormContext.getValues().message,
    };
    alert(JSON.stringify(obj, null, 2));
    reset();
    setOpenDialog(false);
  };

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (isDirty) {
      if (
        !confirm(
          'โพสต์ของคุณยังไม่ถูกเผยแพร่ \nคุณต้องการออกจากหน้านี้ใช่หรือไม่?'
        )
      ) {
        return;
      }
    }

    callback();
  };

  const handleCloseDialog = () => {
    openUnsavedChangesDialog(() => {
      setOpenDialog(false);
      setTabsValue('post');
      reset();
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="create-post-dialog"
      sx={{
        borderRadius: '20px',
      }}
    >
      <TabContext value={tabsValue}>
        <TabPanel value="post">
          <DialogTitle id="create-post-dialog">
            สร้างโพสต์
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="body2">โพสต์ไปยัง</Typography>
              <Chip
                clickable
                variant="outlined"
                size="small"
                deleteIcon={<ArrowDropDownIcon />}
                onClick={() => {
                  setTabsValue('set post to');
                }}
                onDelete={() => {
                  setTabsValue('set post to');
                }}
                label={postTo.map((classroom) => classroom.name).join(', ')}
              />
            </Stack>
            <form>
              <InputBase
                autoFocus
                fullWidth
                multiline
                rows={6}
                placeholder="คุณกำลังคิดอะไรอยู่?"
                inputProps={{ 'aria-label': 'write your post' }}
                sx={{
                  fontSize: '1.2rem',
                }}
                {...register('message')}
              />
              <Divider light sx={{ my: 2 }} />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(onSubmit)()}
              >
                โพสต์
              </Button>
            </form>
          </DialogContent>
        </TabPanel>

        <TabPanel value="set post to">
          <DialogTitle id="create-post-dialog">
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                position: 'absolute',
                left: 12,
                top: 12,
              }}
            >
              <IconButton
                aria-label="back"
                disabled={postTo.length === 0}
                onClick={() => {
                  setTabsValue('post');
                }}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              เลือกคลาสเรียนที่ต้องการโพสต์
            </Stack>
          </DialogTitle>
          <DialogContent>
            <FormControl
              required
              error={postTo.length === 0}
              component="fieldset"
              variant="standard"
            >
              <FormLabel component="legend">คลาสเรียน</FormLabel>
              <FormGroup>
                {course?.classrooms.map((classroom) => (
                  <FormControlLabel
                    key={classroom.id}
                    control={
                      <Checkbox
                        checked={postTo.some(
                          (classroomToPost) =>
                            classroomToPost.id === classroom.id
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPostTo([...postTo, classroom]);
                          } else {
                            setPostTo(
                              postTo.filter(
                                (classroomToPost) =>
                                  classroomToPost.id !== classroom.id
                              )
                            );
                          }
                        }}
                      />
                    }
                    label={
                      classroom.slug === classroomSlug
                        ? `${classroom.name} (คลาสเรียนปัจจุบัน)`
                        : classroom.name
                    }
                  />
                ))}
              </FormGroup>

              {postTo.length === 0 && (
                <FormHelperText>
                  โปรดเลือกคลาสเรียนที่ต้องการโพสต์
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
        </TabPanel>
      </TabContext>
    </Dialog>
  );
};

export default CreatePostDialog;

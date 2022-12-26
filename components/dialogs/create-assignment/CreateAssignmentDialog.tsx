import { useCourseSlug } from '@/hooks/courses/useCourses';
import { openCreateAssignmentDialogAtom } from '@/stores/create-assignment';
import { Classroom } from '@/types/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabPanel } from '@mui/lab';
import {
  alpha,
  AppBar,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Zoom,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { atom, useAtom } from 'jotai';
import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export interface ICreateAssignmentDialog {
  classroomSlug?: string;
  courseSlug?: string;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return (
    <Zoom
      ref={ref}
      {...props}
      unmountOnExit
      style={{ transitionDelay: '50ms' }}
    />
  );
});

const tabsValueAtom = atom('create-assignment');
export const unsavedChangesAtom = atom(false);
export const postToAtom = atom<Classroom[]>([]);

const CreateAssignmentDialog: React.FC<ICreateAssignmentDialog> = ({
  classroomSlug,
  courseSlug,
}) => {
  const [openDialog, setOpenDialog] = useAtom(openCreateAssignmentDialogAtom);
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

  const postFormContext = useForm({
    defaultValues: { title: '', description: '' },
  });

  const { handleSubmit, watch, formState, reset } = postFormContext;
  const { isDirty } = formState;

  const onSubmit = () => {
    const { title, description } = watch();
    const obj = {
      courseId: course?.id,
      classroomIds: postTo.map((classroom) => classroom.id),
      title: title,
      description: description,
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
      setTabsValue('create-assignment');
      reset();
    });
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="create-assignment-dialog"
      TransitionComponent={Transition}
    >
      <TabContext value={tabsValue}>
        <TabPanel value="create-assignment" sx={{ p: 0 }}>
          <AppBar
            color="transparent"
            elevation={0}
            sx={{
              position: 'relative',
              borderBottom: (theme) =>
                `1px double ${alpha(theme.palette.text.primary, 0.2)}`,
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                มอบหมายงาน
              </Typography>
              <Button
                autoFocus
                color="primary"
                variant="contained"
                onClick={() => handleSubmit(onSubmit)()}
              >
                โพสต์
              </Button>
            </Toolbar>
          </AppBar>
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
                  setTabsValue('set-post-to');
                }}
                onDelete={() => {
                  setTabsValue('set-post-to');
                }}
                label={postTo.map((classroom) => classroom.name).join(', ')}
              />
            </Stack>
            <FormContainer formContext={postFormContext}>
              <Stack
                sx={{ pt: 2 }}
                direction="column"
                spacing={2}
                justifyContent="center"
              >
                <TextFieldElement
                  fullWidth
                  label="หัวข้อ"
                  name="title"
                  validation={{
                    required: {
                      value: true,
                      message: 'คุณจำเป็นต้องกรอก หัวข้อ',
                    },
                  }}
                />
                <TextFieldElement
                  fullWidth
                  label="รายละเอียด"
                  name="description"
                  multiline
                  rows={6}
                />
              </Stack>
              <Divider light sx={{ my: 2 }} />
            </FormContainer>
          </DialogContent>
        </TabPanel>

        <TabPanel value="set-post-to" sx={{ p: 0 }}>
          <AppBar
            color="transparent"
            elevation={0}
            sx={{
              position: 'relative',
              borderBottom: (theme) =>
                `1px double ${alpha(theme.palette.text.primary, 0.2)}`,
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="back"
                disabled={postTo.length === 0}
                onClick={() => {
                  setTabsValue('create-assignment');
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                เลือกคลาสเรียนที่ต้องการมอบหมาย
              </Typography>
            </Toolbar>
          </AppBar>
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

export default CreateAssignmentDialog;

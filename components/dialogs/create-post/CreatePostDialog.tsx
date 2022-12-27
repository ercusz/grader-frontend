import PostToForm from '@/components/forms/post-to/PostToForm';
import { useCourseSlug } from '@/hooks/courses/useCourses';
import { openCreatePostDialogAtom, postToAtom } from '@/stores/create-post';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
  }, [classroomSlug, course, openDialog, setPostTo]);

  const postFormContext = useForm({ defaultValues: { message: '' } });

  const { handleSubmit, register, formState, reset } = postFormContext;
  const { isDirty } = formState;

  const onSubmit = () => {
    const obj = {
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

  const CustomTabPanel = ({
    tabValue,
    dialogTitle,
    children,
  }: {
    tabValue: string;
    dialogTitle: React.ReactNode;
    children: React.ReactNode;
  }) => {
    return (
      <TabPanel value={tabValue}>
        <DialogTitle id="create-post-dialog">{dialogTitle}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </TabPanel>
    );
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
        <CustomTabPanel
          tabValue="post"
          dialogTitle={
            <>
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
            </>
          }
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
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
        </CustomTabPanel>

        <CustomTabPanel
          tabValue="set-post-to"
          dialogTitle={
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
          }
        >
          <PostToForm
            classroomSlug={classroomSlug!}
            courseSlug={courseSlug!}
            postToAtom={postToAtom}
          />
        </CustomTabPanel>
      </TabContext>
    </Dialog>
  );
};

export default CreatePostDialog;

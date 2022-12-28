import { markdownEditorValueAtom } from '@/components/editors/markdown/MarkdownEditor';
import CreateAssignmentForm from '@/components/forms/create-assignment/CreateAssignmentForm';
import PostToForm from '@/components/forms/post-to/PostToForm';
import { useCourseSlug } from '@/hooks/courses/useCourses';
import {
  openCreateAssignmentDialogAtom,
  postToAtom,
} from '@/stores/create-assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

import { TabContext, TabPanel } from '@mui/lab';
import {
  alpha,
  AppBar,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Zoom,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { atom, useAtom } from 'jotai';
import React, { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

const CustomTabPanel = ({
  tabValue,
  actionButton,
  children,
}: {
  tabValue: string;
  actionButton: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <TabPanel
      value={tabValue}
      sx={{
        p: 0,
        height: '100%',
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      <AppBar
        color="transparent"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (theme) =>
            `1px double ${alpha(theme.palette.text.primary, 0.2)}`,
        }}
      >
        <Toolbar>{actionButton}</Toolbar>
      </AppBar>
      <DialogContent
        sx={{
          bgcolor: (theme) => theme.palette.background.default,
        }}
      >
        {children}
      </DialogContent>
    </TabPanel>
  );
};

const CreateAssignmentDialog: React.FC<ICreateAssignmentDialog> = ({
  classroomSlug,
  courseSlug,
}) => {
  const [openDialog, setOpenDialog] = useAtom(openCreateAssignmentDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [postTo, setPostTo] = useAtom(postToAtom);
  const [editorValue, setEditorValue] = useAtom(markdownEditorValueAtom);
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

  const postFormContext = useForm({
    defaultValues: { title: '' },
  });

  const { handleSubmit, watch, formState, reset } = postFormContext;
  const { isDirty } = formState;

  const onSubmit = () => {
    const { title } = watch();
    const obj = {
      classroomIds: postTo.map((classroom) => classroom.id),
      title: title,
      content: editorValue,
    };
    alert(JSON.stringify(obj, null, 2));

    // if post success
    reset();
    setEditorValue('');

    setOpenDialog(false);
  };

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (isDirty || editorValue) {
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
      setEditorValue('');
    });
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="create-assignment-dialog"
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: (theme) => theme.palette.background.default,
        },
      }}
    >
      <TabContext value={tabsValue}>
        <CustomTabPanel
          tabValue="create-assignment"
          actionButton={
            <>
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
          <CreateAssignmentForm formContext={postFormContext} />
        </CustomTabPanel>

        <CustomTabPanel
          tabValue="set-post-to"
          actionButton={
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setTabsValue('create-assignment')}
                aria-label="back"
                disabled={postTo.length === 0}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                เลือกคลาสเรียนที่ต้องการโพสต์
              </Typography>
            </>
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

export default CreateAssignmentDialog;

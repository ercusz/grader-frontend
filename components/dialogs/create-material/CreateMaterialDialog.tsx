import { markdownEditorValueAtom } from '@/components/editors/markdown/MarkdownEditor';
import CreateMaterialForm from '@/components/forms/create-material/CreateMaterialForm';
import PostToForm from '@/components/forms/post-to/PostToForm';
import TopicForm from '@/components/forms/topic/TopicForm';
import { useCourseSlug } from '@/hooks/courses/useCourses';
import {
  filesAtom,
  openCreateMaterialDialogAtom,
  postToAtom,
} from '@/stores/create-material';
import { CreateMaterial } from '@/types/types';
import { createMaterial } from '@/utils/MaterialService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabPanel } from '@mui/lab';
import {
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
import { alpha } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import React, { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ICreateMaterialDialog {
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

const tabsValueAtom = atom('create-material');

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
        position="sticky"
        elevation={0}
        sx={{
          color: (theme) => theme.palette.text.primary,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.72),
          transition: 'all 0.2s ease-in-out',
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

export type CreateMaterialFormValues = {
  title: string;
  publishedDate: Date;
};

const CreateMaterialDialog: React.FC<ICreateMaterialDialog> = ({
  classroomSlug,
  courseSlug,
}) => {
  const [openDialog, setOpenDialog] = useAtom(openCreateMaterialDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [postTo, setPostTo] = useAtom(postToAtom);
  const [editorValue, setEditorValue] = useAtom(markdownEditorValueAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (body: CreateMaterial) =>
      createMaterial(body, files?.map(({ fileObj }) => fileObj) || []),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['materials']);
        alert('เพิ่มเอกสารใหม่สำเร็จ');
        reset();
        setEditorValue('');
        setFiles([]);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการเพิ่มเอกสารใหม่');
      },
    }
  );

  useEffect(() => {
    if (openDialog && course) {
      let classroom = course.classrooms.find(
        (classroom) => classroom.slug === classroomSlug
      );
      if (classroom) {
        setPostTo([
          {
            classroom,
            topic: null,
          },
        ]);
      }
    }
  }, [classroomSlug, course, openDialog, setPostTo]);

  const createMaterialFormContext = useForm<CreateMaterialFormValues>({
    defaultValues: {
      title: '',
    },
  });

  const { handleSubmit, watch, formState, reset, register } =
    createMaterialFormContext;
  const { errors, dirtyFields } = formState;

  const onSubmit = () => {
    const { title, publishedDate } = watch();

    const obj = {
      postTo: postTo.map(({ classroom, topic }) => {
        return { classroomId: classroom.id, topicId: topic ? topic.id : null };
      }),
      title: title,
      publishedDate: publishedDate.toISOString(),
      content: editorValue,
    };

    mutation.mutate(obj);

    setOpenDialog(false);
  };

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (
      editorValue ||
      (files && files.length > 0) ||
      Object.keys(dirtyFields).length > 0
    ) {
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
      setTabsValue('create-material');
      reset();
      setEditorValue('');
      setFiles(null);
    });
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="create-material-dialog"
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: (theme) => theme.palette.background.default,
        },
      }}
    >
      <TabContext value={tabsValue}>
        <CustomTabPanel
          tabValue="create-material"
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
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                component="div"
                noWrap
              >
                เพิ่มเอกสารประกอบการสอน
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
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
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
                label={postTo.map(({ classroom }) => classroom.name).join(', ')}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">หัวข้อ</Typography>
              <Chip
                clickable
                variant="outlined"
                size="small"
                deleteIcon={<ArrowDropDownIcon />}
                onClick={() => {
                  setTabsValue('set-topic');
                }}
                onDelete={() => {
                  setTabsValue('set-topic');
                }}
                label={
                  postTo.filter(({ topic }) => topic).length > 0
                    ? postTo
                        .filter(({ topic }) => topic)
                        .map(({ topic }) => topic?.name)
                        .join(', ')
                    : 'ไม่มี'
                }
              />
            </Stack>
          </Stack>
          <CreateMaterialForm formContext={createMaterialFormContext} />
        </CustomTabPanel>

        <CustomTabPanel
          tabValue="set-post-to"
          actionButton={
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setTabsValue('create-material')}
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

        <CustomTabPanel
          tabValue="set-topic"
          actionButton={
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setTabsValue('create-material')}
                aria-label="back"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                component="div"
                noWrap
              >
                เลือกหัวข้อของเอกสาร
              </Typography>
            </>
          }
        >
          <TopicForm postToAtom={postToAtom} />
        </CustomTabPanel>
      </TabContext>
    </Dialog>
  );
};

export default CreateMaterialDialog;

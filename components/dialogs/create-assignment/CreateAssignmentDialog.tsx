import { markdownEditorValueAtom } from '@/components/editors/markdown/MarkdownEditor';
import CreateAssignmentForm, {
  deductTypeAtom,
  enabledPointDeductionAtom,
  problemTypeAtom,
} from '@/components/forms/create-assignment/CreateAssignmentForm';
import PostToForm from '@/components/forms/post-to/PostToForm';
import TopicForm from '@/components/forms/topic/TopicForm';
import { useCourseSlug } from '@/hooks/courses/useCourses';
import { useTestcases } from '@/hooks/grader/useTestcases';
import {
  openCreateAssignmentDialogAtom,
  postToAtom,
} from '@/stores/create-assignment';
import { CreateAssignment } from '@/types/types';
import { addAssignments } from '@/utils/AssignmentService';
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
  InputAdornment,
  Stack,
  TextField,
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

export type CreateAssignmentFormValues = {
  title: string;
  startDate: Date;
  endDate: Date;
  point: number;
  timeLimit: number | null;
  memoryLimit: number | null;
  deductPoint: number | null;
  minPoint: number | null;
};

const CreateAssignmentDialog: React.FC<ICreateAssignmentDialog> = ({
  classroomSlug,
  courseSlug,
}) => {
  const [openDialog, setOpenDialog] = useAtom(openCreateAssignmentDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [postTo, setPostTo] = useAtom(postToAtom);
  const [editorValue, setEditorValue] = useAtom(markdownEditorValueAtom);
  const [problemType] = useAtom(problemTypeAtom);
  const [enabledPointDeduction] = useAtom(enabledPointDeductionAtom);
  const [deductType] = useAtom(deductTypeAtom);
  const { testcases, resetTestcases } = useTestcases();
  const { data: course } = useCourseSlug({ slug: courseSlug });
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (assignment: CreateAssignment) => addAssignments(assignment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignments']);
        alert('เพิ่มงานใหม่สำเร็จ');
        reset();
        setEditorValue('');
        resetTestcases();
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการเพิ่มงานใหม่');
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
      resetTestcases();
    }
  }, [classroomSlug, course, openDialog, resetTestcases, setPostTo]);

  const createAssignmentFormContext = useForm<CreateAssignmentFormValues>({
    defaultValues: {
      title: '',
      timeLimit: null,
      memoryLimit: null,
      point: 100,
      deductPoint: null,
      minPoint: null,
    },
  });

  const { handleSubmit, watch, formState, reset, register } =
    createAssignmentFormContext;
  const { errors, dirtyFields } = formState;

  const onSubmit = () => {
    const {
      title,
      startDate,
      endDate,
      timeLimit,
      memoryLimit,
      point,
      deductPoint,
      minPoint,
    } = watch();

    if (problemType !== 'java-src' && problemType !== 'docs') {
      alert('กรุณาเลือกประเภทของงาน');
      return;
    }

    if (problemType === 'java-src' && testcases.length === 0) {
      alert('กรุณาเพิ่ม testcases อย่างน้อย 1 ชุด');
      return;
    }

    let obj: CreateAssignment = {
      postTo: postTo.map(({ classroom, topic }) => {
        return { classroomId: classroom.id, topicId: topic ? topic.id : null };
      }),
      title: title,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type: problemType,
      content: editorValue,
      point: point,
      enabledPointDeduction: enabledPointDeduction,
    };

    if (problemType === 'java-src') {
      obj.timeLimit = timeLimit;
      obj.memoryLimit = memoryLimit;
      obj.testcases = testcases.map((testcase) => ({
        name: testcase.name,
        input: testcase.input,
        expectedOutput: testcase.expectedOutput,
      }));
    }

    if (enabledPointDeduction) {
      obj.deductPoint = deductPoint;
      obj.deductType = deductType || null;
      obj.minPoint = minPoint;
    }

    mutation.mutate(obj);

    setOpenDialog(false);
  };

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (
      editorValue ||
      testcases.length > 0 ||
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
      setTabsValue('create-assignment');
      reset();
      setEditorValue('');
      resetTestcases();
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
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                component="div"
                noWrap
              >
                มอบหมายงาน
              </Typography>
              {errors.point && (
                <Typography variant="caption" color="red">
                  {errors.point.message}
                </Typography>
              )}
              <TextField
                id="point"
                label="คะแนน"
                size="small"
                sx={{ m: 1, width: '12ch' }}
                autoComplete="off"
                error={errors.point ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">/100</InputAdornment>
                  ),
                }}
                {...register('point', {
                  required: 'คุณจำเป็นต้องกรอกคะแนน',
                  min: {
                    value: 1,
                    message: 'คุณจำเป็นต้องกรอกคะแนนมากกว่า 0 คะแนน',
                  },
                  max: {
                    value: 100,
                    message: 'คุณจำเป็นต้องกรอกคะแนนน้อยกว่า 100 คะแนน',
                  },
                })}
              />
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
          <CreateAssignmentForm formContext={createAssignmentFormContext} />
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

        <CustomTabPanel
          tabValue="set-topic"
          actionButton={
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setTabsValue('create-assignment')}
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
                เลือกหัวข้องาน
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

export default CreateAssignmentDialog;

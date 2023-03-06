import { markdownEditorValueAtom } from '@/components/editors/markdown/MarkdownEditor';
import CreateAssignmentForm, {
  deductTypeAtom,
  enabledPointDeductionAtom,
  postDateTypeAtom,
  problemTypeAtom,
} from '@/components/forms/create-assignment/CreateAssignmentForm';
import TopicForm from '@/components/forms/topic/TopicForm';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useTestcases } from '@/hooks/grader/useTestcases';
import {
  openEditAssignmentDialogAtom,
  postToAtom,
} from '@/stores/edit-assignment';
import { Assignment, EditAssignment } from '@/types/types';
import { editAssignment } from '@/utils/AssignmentService';
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
import { parseISO } from 'date-fns';
import { atom, useAtom } from 'jotai';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CreateAssignmentFormValues } from '../create-assignment/CreateAssignmentDialog';

export interface IEditAssignmentDialog {
  classroomSlug?: string;
  assignment: Assignment;
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

const tabsValueAtom = atom('edit-assignment');

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

const EditAssignmentDialog: React.FC<IEditAssignmentDialog> = ({
  classroomSlug,
  assignment,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const [openDialog, setOpenDialog] = useAtom(openEditAssignmentDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [editorValue, setEditorValue] = useAtom(markdownEditorValueAtom);
  const [problemType, setProblemType] = useAtom(problemTypeAtom);
  const { testcases, setTestcases } = useTestcases();
  const [, setPostDateType] = useAtom(postDateTypeAtom);
  const [, setEnabledPointDeduction] = useAtom(enabledPointDeductionAtom);
  const [, setDeductType] = useAtom(deductTypeAtom);
  const [postTo, setPostTo] = useAtom(postToAtom);
  const [enabledPointDeduction] = useAtom(enabledPointDeductionAtom);
  const [deductType] = useAtom(deductTypeAtom);

  useEffect(() => {
    if (assignment) {
      setPostDateType('custom');
      setProblemType(assignment.type);
      setEditorValue(assignment.content);
      setEnabledPointDeduction(assignment.enabledPointDeduction);
      if (assignment.deductType) {
        setDeductType(assignment.deductType);
      }
      if (assignment.testcases) {
        setTestcases(assignment.testcases);
      }
    }
  }, [
    assignment,
    classroom,
    setDeductType,
    setEditorValue,
    setEnabledPointDeduction,
    setPostDateType,
    setPostTo,
    setProblemType,
    setTestcases,
  ]);

  useEffect(() => {
    if (openDialog && classroom) {
      setPostTo([
        {
          classroom,
          topic: assignment.topic || null,
        },
      ]);
    }
  }, [assignment.topic, classroom, openDialog, setPostTo]);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (assignment: EditAssignment) =>
      editAssignment(assignment, classroom?.id.toString() as string),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignment', { id: assignment.id }]);
        alert('แก้ไขงานสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการแก้ไขงาน');
      },
    }
  );

  const defaultValues = useMemo(() => {
    return {
      title: assignment.title ? assignment.title : '',
      timeLimit: assignment.timeLimit ? assignment.timeLimit : null,
      point: assignment.point ? assignment.point : 100,
      memoryLimit: assignment.memoryLimit ? assignment.memoryLimit : null,
      deductPoint: assignment.deductPoint ? assignment.deductPoint : null,
      minPoint: assignment.minPoint ? assignment.minPoint : 0,
      startDate: assignment.startDate
        ? parseISO(assignment?.startDate)
        : undefined,
      endDate: assignment.endDate ? parseISO(assignment?.endDate) : undefined,
    };
  }, [assignment]);

  const createAssignmentFormContext = useForm<CreateAssignmentFormValues>({
    defaultValues: defaultValues,
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

    let obj: EditAssignment = {
      id: assignment.id.toString(),
      title: title,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type: problemType,
      content: editorValue,
      point: point,
      enabledPointDeduction: enabledPointDeduction,
      topic: postTo[0].topic || null,
    };

    if (problemType === 'java-src') {
      obj.timeLimit = timeLimit;
      obj.memoryLimit = memoryLimit;
      obj.testcases = testcases.map((testcase) => ({
        id: testcase.id,
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
      editorValue !== assignment.content ||
      testcases.length !== assignment.testcases?.length ||
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
      setTabsValue('edit-assignment');
      reset();
      setEditorValue(assignment.content);
      setTestcases(assignment.testcases);
    });
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="edit-assignment-dialog"
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: (theme) => theme.palette.background.default,
        },
      }}
    >
      <TabContext value={tabsValue}>
        <CustomTabPanel
          tabValue="edit-assignment"
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
                แก้ไขงาน
              </Typography>
              {errors.point && (
                <Typography variant="caption" color="red" sx={{}}>
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
          <CreateAssignmentForm formContext={createAssignmentFormContext} />
        </CustomTabPanel>

        <CustomTabPanel
          tabValue="set-topic"
          actionButton={
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setTabsValue('edit-assignment')}
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

export default EditAssignmentDialog;

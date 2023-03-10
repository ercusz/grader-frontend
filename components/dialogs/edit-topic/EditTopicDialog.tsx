import EditTopicForm from '@/components/forms/edit-topic/EditTopicForm';
import { useAssignments } from '@/hooks/assignment/useAssignment';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useMaterials } from '@/hooks/material/useMaterial';
import { useTopic } from '@/hooks/topic/useTopic';
import {
  defaultLeftAssignmentAtom,
  defaultLeftMaterialAtom,
  defaultRightAssignmentAtom,
  defaultRightMaterialAtom,
  openEditTopicDialogAtom,
} from '@/stores/edit-topic';
import { Assignment, CreateTopic, Material } from '@/types/types';
import { updateTopic } from '@/utils/TopicServices';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabPanel } from '@mui/lab';
import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
  Zoom,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export interface IEditTopicDialog {
  classroomSlug: string;
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

const tabsValueAtom = atom('edit-topic');

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

const EditTopicDialog: React.FC<IEditTopicDialog> = ({ classroomSlug }) => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const { data: topic } = useTopic({
    topicId: id,
    classroomId: classroom?.id.toString(),
  });

  const [openDialog, setOpenDialog] = useAtom(openEditTopicDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [, setLeftAssignment] = useAtom(defaultLeftAssignmentAtom);
  const [rightAssignment, setRightAssignment] = useAtom(
    defaultRightAssignmentAtom
  );
  const [, setLeftMaterial] = useAtom(defaultLeftMaterialAtom);
  const [rightMaterial, setRightMaterial] = useAtom(defaultRightMaterialAtom);

  const {
    data: { assignments, topics: topicsWithAssignment } = {
      assignments: [],
      topics: [],
    },
  } = useAssignments({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const {
    data: { materials, topics: topicsWithMaterial } = {
      materials: [],
      topics: [],
    },
  } = useMaterials({
    classroomId: classroom?.id ? classroom.id.toString() : '',
  });

  const currentAssignments = useMemo(() => {
    return topicsWithAssignment
      .filter((topic) => topic.id === Number(id) && Boolean(topic.assignments))
      .flatMap(({ assignments }) => assignments);
  }, [id, topicsWithAssignment]);

  const currentMaterials = useMemo(() => {
    return topicsWithMaterial
      .filter((topic) => topic.id === Number(id) && Boolean(topic.materials))
      .flatMap(({ materials }) => materials);
  }, [id, topicsWithMaterial]);

  // Set default value for left and right assignment
  useEffect(() => {
    if (assignments) {
      setLeftAssignment(assignments);
    }

    if (currentAssignments) {
      setRightAssignment(currentAssignments as Assignment[]);
    }
  }, [assignments, currentAssignments, setLeftAssignment, setRightAssignment]);

  // Set default value for left and right material
  useEffect(() => {
    if (materials) {
      setLeftMaterial(materials);
    }

    if (currentMaterials) {
      setRightMaterial(currentMaterials as Material[]);
    }
  }, [currentMaterials, materials, setLeftMaterial, setRightMaterial]);

  const defaultValues = useMemo(() => {
    return {
      name: topic?.name ? topic?.name : '',
    };
  }, [topic]);

  const editTopicFormContext = useForm({
    defaultValues: defaultValues,
  });

  const queryClient = useQueryClient();
  const updateMutation = useMutation(
    (body: CreateTopic & { assignments: number[]; materials: number[] }) =>
      updateTopic(id, classroom?.id.toString() as string, body),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['topic', { id: id }]);
        alert('แก้ไขหัวข้อสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการแก้ไขหัวข้อ');
      },
    }
  );

  const { handleSubmit, formState, reset } = editTopicFormContext;
  const { dirtyFields } = formState;

  const onSubmit = () => {
    const name = editTopicFormContext.getValues('name');
    const req = {
      name: name,
      assignments: rightAssignment.map((assignment: any) => assignment.id),
      materials: rightMaterial.map((material: any) => material.id),
    };

    updateMutation.mutate(req);

    setOpenDialog(false);
  };

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (Object.keys(dirtyFields).length > 0) {
      if (
        !confirm(
          'การแก้ไขของคุณยังไม่ถูกบันทึก \nคุณต้องการออกจากหน้านี้ใช่หรือไม่?'
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
      setTabsValue('edit-topic');
      reset();
    });
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="edit-topic-dialog"
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: (theme) => theme.palette.background.default,
        },
      }}
    >
      <TabContext value={tabsValue}>
        <CustomTabPanel
          tabValue="edit-topic"
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
                จัดการหัวข้อ
              </Typography>
              <Button
                autoFocus
                color="primary"
                variant="contained"
                onClick={() => handleSubmit(onSubmit)()}
              >
                บันทึก
              </Button>
            </>
          }
        >
          {classroom &&
            assignments &&
            materials &&
            topicsWithAssignment &&
            topicsWithMaterial && (
              <EditTopicForm formContext={editTopicFormContext} />
            )}
        </CustomTabPanel>
      </TabContext>
    </Dialog>
  );
};

export default EditTopicDialog;

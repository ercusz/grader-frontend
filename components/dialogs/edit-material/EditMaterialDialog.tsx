import { markdownEditorValueAtom } from '@/components/editors/markdown/MarkdownEditor';
import CreateMaterialForm, {
  postDateTypeAtom,
} from '@/components/forms/create-material/CreateMaterialForm';
import TopicForm from '@/components/forms/topic/TopicForm';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { filesAtom } from '@/stores/create-material';
import { openEditMaterialDialogAtom, postToAtom } from '@/stores/edit-material';
import { EditMaterial, Material, UploadedFile } from '@/types/types';
import { editMaterial } from '@/utils/MaterialService';
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
import { parseISO } from 'date-fns';
import { atom, useAtom } from 'jotai';
import React, { forwardRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CreateMaterialFormValues } from '../create-material/CreateMaterialDialog';

export interface IEditMaterialDialog {
  classroomSlug?: string;
  material: Material;
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

const tabsValueAtom = atom('edit-material');

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

const EditMaterialDialog: React.FC<IEditMaterialDialog> = ({
  classroomSlug,
  material,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const [openDialog, setOpenDialog] = useAtom(openEditMaterialDialogAtom);
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);
  const [editorValue, setEditorValue] = useAtom(markdownEditorValueAtom);
  const [, setPostDateType] = useAtom(postDateTypeAtom);
  const [postTo, setPostTo] = useAtom(postToAtom);
  const [files, setFiles] = useAtom(filesAtom);

  useEffect(() => {
    if (openDialog && material) {
      setPostDateType('custom');
      setEditorValue(material.content);
      if (material.files) {
        setFiles(material.files as UploadedFile[]);
      }
    }
  }, [material, openDialog, setEditorValue, setFiles, setPostDateType]);

  useEffect(() => {
    if (openDialog && classroom) {
      setPostTo([
        {
          classroom,
          topic: material.topic || null,
        },
      ]);
    }
  }, [material.topic, classroom, openDialog, setPostTo]);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (obj: EditMaterial) =>
      editMaterial(
        material?.id.toString() as string,
        classroom?.id.toString() as string,
        obj
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['material', { id: material.id }]);
        alert('แก้ไขงานสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการแก้ไขงาน');
      },
    }
  );

  const defaultValues = useMemo(() => {
    return {
      title: material.title ? material.title : '',
      publishedDate: material.publishedDate
        ? parseISO(material.publishedDate)
        : undefined,
    };
  }, [material.publishedDate, material.title]);

  const createMaterialFormContext = useForm<CreateMaterialFormValues>({
    defaultValues: defaultValues,
  });

  const { handleSubmit, watch, formState, reset } = createMaterialFormContext;
  const { dirtyFields } = formState;

  const onSubmit = () => {
    const { title, publishedDate } = watch();

    let newFiles: File[] = [];
    let currentFiles: number[] = [];
    if (files) {
      files.forEach((file) => {
        if (file.fileObj) {
          newFiles.push(file.fileObj);
        } else {
          currentFiles.push(file.id);
        }
      });
    }

    let obj = {
      postTo: postTo.map(({ classroom, topic }) => {
        return { classroomId: classroom.id, topicId: topic ? topic.id : null };
      }),
      title: title,
      publishedDate: publishedDate.toISOString(),
      content: editorValue,
      files: currentFiles,
      newFiles: newFiles,
    };

    mutation.mutate(obj);

    setOpenDialog(false);
  };

  const openUnsavedChangesDialog = (callback: () => void) => {
    if (
      editorValue !== material.content ||
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
      setTabsValue('edit-material');
      reset();
      setEditorValue('');
      setFiles([]);
    });
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="edit-material-dialog"
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: (theme) => theme.palette.background.default,
        },
      }}
    >
      <TabContext value={tabsValue}>
        <CustomTabPanel
          tabValue="edit-material"
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
                แก้ไขเอกสาร
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
          <CreateMaterialForm formContext={createMaterialFormContext} />
        </CustomTabPanel>

        <CustomTabPanel
          tabValue="set-topic"
          actionButton={
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setTabsValue('edit-material')}
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

export default EditMaterialDialog;

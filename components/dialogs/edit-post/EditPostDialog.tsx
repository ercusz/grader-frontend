import { EditPost, Post } from '@/types/types';
import { editPost } from '@/utils/PostService';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export interface IEditPostDialog {
  post: Post;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

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

const tabsValueAtom = atom('post');

const EditPostDialog: React.FC<IEditPostDialog> = ({
  post,
  openDialog,
  setOpenDialog,
}) => {
  const [tabsValue, setTabsValue] = useAtom(tabsValueAtom);

  const defaultValues = useMemo(() => {
    return {
      content: post.content ? post.content : '',
    };
  }, [post]);

  const postFormContext = useForm({ defaultValues: defaultValues });

  const { handleSubmit, register, formState, reset } = postFormContext;
  const { isDirty } = formState;

  const queryClient = useQueryClient();
  const mutation = useMutation((post: EditPost) => editPost(post), {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      alert('แก้ไขโพสต์สำเร็จ');
      reset();
    },
    onError: () => {
      alert('เกิดข้อผิดพลาดในการแก้ไขโพสต์');
    },
  });

  const onSubmit = () => {
    const obj: EditPost = {
      id: post.id,
      classroomId: post.classroomId,
      content: postFormContext.getValues().content,
    };

    mutation.mutate(obj);

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
        <CustomTabPanel
          tabValue="post"
          dialogTitle={
            <>
              แก้ไขโพสต์
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
              {...register('content')}
            />
            <Divider light sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleSubmit(onSubmit)()}
            >
              แก้ไขโพสต์
            </Button>
          </form>
        </CustomTabPanel>
      </TabContext>
    </Dialog>
  );
};

export default EditPostDialog;

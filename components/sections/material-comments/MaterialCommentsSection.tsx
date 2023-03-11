import CreateCommentForm from '@/components/forms/create-comment/CreateCommentForm';
import CommentList from '@/components/lists/comment/CommentList';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { useMaterialComments } from '@/hooks/comment/useComment';
import { Material } from '@/types/types';
import {
  createMaterialComment,
  deleteMaterialComment,
} from '@/utils/CommentService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface IMaterialCommentsSection {
  material: Material;
  classroomSlug: string;
}

const MaterialCommentsSection: React.FC<IMaterialCommentsSection> = ({
  material,
  classroomSlug,
}) => {
  const [openCommentSection, setOpenCommentSection] = useState(true);

  const handleOpenCommentSection = () => {
    setOpenCommentSection(!openCommentSection);
  };

  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const { data: comments } = useMaterialComments({
    classroomId: classroom?.id.toString() as string,
    materialId: material?.id?.toString() as string,
  });

  const queryClient = useQueryClient();
  interface ICreateCommentParams {
    content: string;
    onSuccessCallback?: () => void;
  }
  const createMutation = useMutation(
    (params: ICreateCommentParams) =>
      createMaterialComment(
        classroom?.id.toString() as string,
        material?.id?.toString() as string,
        params.content
      ),
    {
      onSuccess: async (data, { onSuccessCallback }) => {
        queryClient.invalidateQueries(['material-comments']);

        onSuccessCallback?.();
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการโพสต์ความคิดเห็น');
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) =>
      deleteMaterialComment(
        classroom?.id.toString() as string,
        material?.id?.toString() as string,
        id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['material-comments']);
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบความคิดเห็น');
      },
    }
  );

  const handleCreateComment = (
    content: string,
    onSuccessCallback?: () => void
  ) => {
    createMutation.mutate({
      content: content,
      onSuccessCallback: onSuccessCallback,
    });
  };

  const handleDeleteComment = (id: string) => {
    if (confirm('ต้องการลบความคิดเห็นนี้หรือไม่?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      {/* Comment Section Header */}
      <ListItemButton onClick={handleOpenCommentSection}>
        <ListItemIcon
          sx={{
            minWidth: { xs: 32, sm: 40 },
          }}
        >
          <EmailIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={<Typography noWrap>ความคิดเห็น</Typography>} />
        {openCommentSection ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      {/* Comments */}
      <Collapse in={openCommentSection} timeout="auto" unmountOnExit>
        <div
          style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}
        >
          {/* Comment Form */}
          <CreateCommentForm onSubmit={handleCreateComment} />

          {/* If comment is empty */}
          {comments && comments.length === 0 && (
            <Typography variant="body2" sx={{ textAlign: 'center', my: 4 }}>
              ยังไม่มีความคิดเห็น
            </Typography>
          )}

          {/* Comment Count */}
          {comments && comments.length > 0 && (
            <Typography variant="body2" sx={{ mt: 4 }}>
              ความคิดเห็น ({comments.length})
            </Typography>
          )}

          {/* Comment List */}
          <CommentList
            comments={comments || []}
            handleDeleteComment={handleDeleteComment}
            sort="newest"
            previewSize={2}
          />
        </div>
      </Collapse>
    </>
  );
};

export default MaterialCommentsSection;

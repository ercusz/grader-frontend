import CreateCommentForm from '@/components/forms/create-comment/CreateCommentForm';
import CommentList from '@/components/lists/comment/CommentList';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import {
  useAssignmentPrivateComments,
  useAssignmentPublicComments,
} from '@/hooks/comment/useComment';
import { Assignment } from '@/types/types';
import {
  createAssignmentComment,
  deleteAssignmentComment,
} from '@/utils/CommentService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import MailLockIcon from '@mui/icons-material/MailLock';
import {
  Collapse,
  FormControlLabel,
  FormGroup,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface IAssignmentCommentsSection {
  assignment: Assignment;
  classroomSlug: string;
  defaultPrivate?: boolean;
  hostId?: string;
}

const AssignmentCommentsSection: React.FC<IAssignmentCommentsSection> = ({
  assignment,
  classroomSlug,
  defaultPrivate = false,
  hostId,
}) => {
  const [isPrivate, setIsPrivate] = useState(defaultPrivate);
  const [openCommentSection, setOpenCommentSection] = useState(true);

  const handleOpenCommentSection = () => {
    setOpenCommentSection(!openCommentSection);
  };

  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });
  const { data: publicComments } = useAssignmentPublicComments({
    classroomId: classroom?.id.toString() as string,
    assignmentId: assignment?.id?.toString() as string,
  });
  const { data: privateComments } = useAssignmentPrivateComments({
    classroomId: classroom?.id.toString() as string,
    assignmentId: assignment?.id?.toString() as string,
    hostId: hostId,
  });

  const queryClient = useQueryClient();
  interface ICreateCommentParams {
    content: string;
    onSuccessCallback?: () => void;
  }
  const createMutation = useMutation(
    (params: ICreateCommentParams) =>
      createAssignmentComment(
        classroom?.id.toString() as string,
        assignment?.id?.toString() as string,
        params.content,
        isPrivate,
        hostId
      ),
    {
      onSuccess: async (data, { onSuccessCallback }) => {
        queryClient.invalidateQueries(['assignment-comments']);

        onSuccessCallback?.();
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการโพสต์ความคิดเห็น');
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) =>
      deleteAssignmentComment(
        classroom?.id.toString() as string,
        assignment?.id?.toString() as string,
        id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignment-comments']);
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

  const isEmptyPrivateComment =
    (isPrivate && privateComments && privateComments.length === 0) ||
    (isPrivate && !privateComments);
  const isEmptyPublicComment =
    (!isPrivate && publicComments && publicComments.length === 0) ||
    (!isPrivate && !publicComments);

  return (
    <>
      {/* Comment Section Header */}
      <ListItemButton onClick={handleOpenCommentSection}>
        <ListItemIcon
          sx={{
            minWidth: { xs: 32, sm: 40 },
          }}
        >
          {isPrivate ? (
            <MailLockIcon fontSize="small" />
          ) : (
            <EmailIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography noWrap>
              {isPrivate ? 'ความคิดเห็น(ส่วนตัว)' : 'ความคิดเห็น'}
            </Typography>
          }
        />
        {openCommentSection ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      {/* Comments */}
      <Collapse in={openCommentSection} timeout="auto" unmountOnExit>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Public/Private Switch */}
          {/* If user is Teacher/TA, User will not see this Switch */}
          <FormGroup
            sx={{
              alignSelf: 'flex-end',
              mt: 1,
              mb: hostId ? 2 : 0,
              visibility: hostId ? 'visible' : 'hidden',
            }}
          >
            <FormControlLabel
              label={
                <Tooltip
                  arrow
                  title="เพื่อนร่วมชั้นจะมองไม่เห็นความคิดเห็นส่วนตัวของคุณ จะมีเพียงผู้สอนหรือผู้ช่วยสอนเท่านั้นที่สามารถมองเห็นได้"
                >
                  <Typography variant="caption">ส่วนตัว</Typography>
                </Tooltip>
              }
              control={
                <Switch
                  size="small"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                />
              }
              sx={{ alignItems: 'center', justifyContent: 'center' }}
            />
          </FormGroup>

          {/* Comment Form */}
          <CreateCommentForm onSubmit={handleCreateComment} />

          {/* If PrivateComment/PublicComment is empty */}
          {(isEmptyPrivateComment || isEmptyPublicComment) && (
            <Typography variant="body2" sx={{ textAlign: 'center', my: 4 }}>
              ยังไม่มีความคิดเห็น{isPrivate ? 'ส่วนตัว' : ''}
            </Typography>
          )}

          {/* Comment Count */}
          {!isEmptyPrivateComment && !isEmptyPublicComment && (
            <Typography variant="body2" sx={{ mt: 4 }}>
              ความคิดเห็น (
              {isPrivate ? privateComments?.length : publicComments?.length})
            </Typography>
          )}

          {/* Comment List */}
          <CommentList
            comments={isPrivate ? privateComments || [] : publicComments || []}
            handleDeleteComment={handleDeleteComment}
            sort="newest"
            previewSize={2}
          />
        </div>
      </Collapse>
    </>
  );
};

export default AssignmentCommentsSection;

import CreateCommentForm from '@/components/forms/create-comment/CreateCommentForm';
import CommentList from '@/components/lists/comment/CommentList';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { Post, UserComment } from '@/types/types';
import { createPostComment, deletePostComment } from '@/utils/CommentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface IPostCommentsSection {
  post: Post;
  classroomSlug: string;
}

const PostCommentsSection: React.FC<IPostCommentsSection> = ({
  post,
  classroomSlug,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });

  const comments = post.comments || ([] as UserComment[]);

  const queryClient = useQueryClient();
  interface ICreateCommentParams {
    content: string;
    onSuccessCallback?: () => void;
  }
  const createMutation = useMutation(
    (params: ICreateCommentParams) =>
      createPostComment(
        classroom?.id.toString() as string,
        post.id.toString() as string,
        params.content
      ),
    {
      onSuccess: async (data, { onSuccessCallback }) => {
        queryClient.invalidateQueries(['posts']);

        onSuccessCallback?.();
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการโพสต์ความคิดเห็น');
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) =>
      deletePostComment(
        classroom?.id.toString() as string,
        post.id.toString() as string,
        id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
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
      <CreateCommentForm onSubmit={handleCreateComment} />

      {comments.length > 0 && (
        <CommentList
          postAuthorId={post.createBy.id}
          comments={comments}
          previewSize={2}
          handleDeleteComment={handleDeleteComment}
        />
      )}
    </>
  );
};

export default PostCommentsSection;

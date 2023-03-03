import CreateCommentForm from '@/components/forms/create-comment/CreateCommentForm';
import CommentList from '@/components/lists/comment/CommentList';
import { useClassroomSlug } from '@/hooks/classrooms/useClassrooms';
import { Post, UserComment } from '@/types/types';
import { createPostComment, deletePostComment } from '@/utils/CommentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface IPostCommentsSection {
  post: Post;
  classroomSlug: string;
}

const PostCommentsSection: React.FC<IPostCommentsSection> = ({
  post,
  classroomSlug,
}) => {
  const { data: classroom } = useClassroomSlug({ slug: classroomSlug });

  const comments = useMemo(() => {
    return post.comments || ([] as UserComment[]);
  }, [post.comments]);

  const queryClient = useQueryClient();
  const createMutation = useMutation(
    (content: string) =>
      createPostComment(
        classroom?.id.toString() as string,
        post.id.toString() as string,
        content
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'posts',
          { classroomId: classroom?.id },
        ]);
        alert('โพสต์ความคิดเห็นสำเร็จ');
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
        queryClient.invalidateQueries([
          'posts',
          { classroomId: classroom?.id },
        ]);
        alert('ลบความคิดเห็นสำเร็จ');
      },
      onError: () => {
        alert('เกิดข้อผิดพลาดในการลบความคิดเห็น');
      },
    }
  );

  const handleCreateComment = (content: string) => {
    createMutation.mutate(content);
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

import { getTopics } from '@/utils/TopicServices';
import { useQuery } from '@tanstack/react-query';

export const useTopics = ({ classroomId }: { classroomId?: string }) =>
  useQuery(
    ['topics', { classroomId: classroomId }],
    () => getTopics(classroomId ? classroomId : ''),
    {
      enabled: Boolean(classroomId),
    }
  );

import { getTopicById, getTopics } from '@/utils/TopicServices';
import { useQuery } from '@tanstack/react-query';

export const useTopics = ({ classroomId }: { classroomId?: string }) =>
  useQuery(
    ['topics', { classroomId: classroomId }],
    () => getTopics(classroomId ? classroomId : ''),
    {
      enabled: Boolean(classroomId),
    }
  );

export const useTopic = ({
  topicId,
  classroomId,
}: {
  topicId?: string;
  classroomId?: string;
}) =>
  useQuery(
    ['topic', { id: topicId }],
    () => getTopicById(topicId ? topicId : '', classroomId ? classroomId : ''),
    {
      enabled: Boolean(topicId),
    }
  );

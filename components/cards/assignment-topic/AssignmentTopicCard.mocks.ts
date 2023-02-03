import { IAssignmentTopicCard } from './AssignmentTopicCard';

const base: IAssignmentTopicCard = {
  topic: {
    id: 1,
    name: 'Topic 1',
    assignments: [],
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
  },
  classroomSlug: '',
};

export const mockAssignmentTopicCardProps = {
  base,
};

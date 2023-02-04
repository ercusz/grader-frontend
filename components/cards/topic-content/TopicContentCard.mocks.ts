import { ITopicContentCard } from './TopicContentCard';

const base: ITopicContentCard = {
  topic: {
    id: 4,
    name: 'Topic 4',
    assignments: [],
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
  },
};

export const mockTopicContentCardProps = {
  base,
};

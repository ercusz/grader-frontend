import { IDeleteTopicDialog } from './DeleteTopicDialog';

const base: IDeleteTopicDialog = {
  classroomSlug: '',
  topic: {
    id: 1,
    name: 'Topic 1',
    assignments: [],
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
  },
};

export const mockDeleteTopicDialogProps = {
  base,
};

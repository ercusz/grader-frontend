import { IAssignmentCommentsSection } from './AssignmentCommentsSection';

const base: IAssignmentCommentsSection = {
  assignment: {
    id: 0,
    classroomId: 0,
    title: '',
    startDate: '',
    endDate: '',
    type: 'java-src',
    content: '',
    point: 0,
    enabledPointDeduction: false,
    deductPoint: undefined,
    deductType: undefined,
    minPoint: undefined,
    timeLimit: undefined,
    memoryLimit: undefined,
    testcases: undefined,
    createdAt: '',
    createBy: {
      id: 0,
      firstName: null,
      lastName: null,
      username: '',
      profileImage: null,
      studentId: undefined,
    },
    updatedAt: '',
    updateBy: null,
    topic: null,
  },
  classroomSlug: '',
};

export const mockAssignmentCommentsSectionProps = {
  base,
};

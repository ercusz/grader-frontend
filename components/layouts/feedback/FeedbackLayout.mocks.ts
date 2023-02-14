import { IFeedbackLayout } from './FeedbackLayout';

const base: IFeedbackLayout = {
  children: '{{component}}',
  feedbackHeaderProps: {
    backButton: false,
    downloadCurrentAssignmentButton: false
  }
};

export const mockFeedbackLayoutProps = {
  base,
};

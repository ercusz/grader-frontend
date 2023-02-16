import { IFeedbackLayout } from './FeedbackLayout';

const base: IFeedbackLayout = {
  children: '{{component}}',
  feedbackHeaderProps: {
    backButton: false,
    downloadCurrentAssignmentButton: false,
  },
  contentProps: {
    subHeader: false,
    sidebar: false,
  },
};

export const mockFeedbackLayoutProps = {
  base,
};

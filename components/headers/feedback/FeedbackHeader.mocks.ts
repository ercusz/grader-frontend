import { IFeedbackHeader } from './FeedbackHeader';

const base: IFeedbackHeader = {
  props: {
    backButton: false,
    downloadCurrentAssignmentButton: false,
  },
  subHeader: undefined,
};

export const mockFeedbackHeaderProps = {
  base,
};

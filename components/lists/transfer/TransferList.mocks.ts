import {
  defaultLeftAssignmentAtom,
  defaultRightAssignmentAtom,
} from '@/stores/edit-topic';
import { ITransferList } from './TransferList';

const base: ITransferList = {
  defaultLeftAtom: defaultLeftAssignmentAtom,
  defaultRightAtom: defaultRightAssignmentAtom,
};

export const mockTransferListProps = {
  base,
};

import { SetStateAction } from 'react';
import { ISideDrawer } from './SideDrawer';

const base: ISideDrawer = {
  openDrawer: false,
  setOpenDrawer: function (value: SetStateAction<boolean>): void {
    throw new Error('Function not implemented.');
  }
};

export const mockSideDrawerProps = {
  base,
};

import { SetStateAction } from 'react';
import { IUserMenu } from './UserMenu';

const base: IUserMenu = {
  anchorElUser: null,
  setAnchorElUser: function (value: SetStateAction<HTMLElement | null>): void {
    throw new Error('Function not implemented.');
  },
};

export const mockUserMenuProps = {
  base,
};

import { SetStateAction } from 'react';
import { IUserMenu } from './UserMenu';

const base: IUserMenu = {
  session: {
    jwt: 'Hello',
    expires: 'ASAP',
    user: {
      id: 0,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe69',
      studentId: '123456789-0',
      email: 'jd@jd.cc',
      role: { id: 999, name: 'Tester' },
      profileImage: { id: 999, url: 'https://i.pravatar.cc/?u=johndoe69' },
    },
  },
  anchorElUser: null,
  setAnchorElUser: function (value: SetStateAction<HTMLElement | null>): void {
    throw new Error('Function not implemented.');
  },
};

export const mockUserMenuProps = {
  base,
};

import { SetStateAction } from 'react';
import { IUserMenu } from './UserMenu';

const base: IUserMenu = {
  session: {
    expires: 'ASAP',
    user: {
      id: 0,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe69',
      user_id: '123456789-0',
      email: 'jd@jd.cc',
      provider: 'abcde',
      confirmed: true,
      blocked: false,
      createdAt: '2022-08-02T09:17:13.404Z',
      updatedAt: '2022-08-17T07:22:31.002Z',
      role: { id: 999, name: 'Tester' },
      profile: { id: 999, url: 'https://i.pravatar.cc/?u=johndoe69' },
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

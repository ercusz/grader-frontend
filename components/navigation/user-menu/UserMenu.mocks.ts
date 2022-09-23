import { SetStateAction } from 'react';
import { IUserMenu } from './UserMenu';

const base: IUserMenu = {
  session: {
    jwt: 'Hello',
    expires: 'ASAP',
    user: {
      id: 0,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe69',
      student_id: '123456789-0',
      email: 'jd@jd.cc',
      role: { id: 999, name: 'Tester' },
      profile_img: { id: 999, url: 'https://i.pravatar.cc/?u=johndoe69' },
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

import { User } from '@/types/types';
import { getUserInfo } from '@/utils/AuthService';
import { useQuery } from '@tanstack/react-query';

let isAuthenticated: boolean = false;
export const setIsAuthenticated = (value: boolean) => {
  isAuthenticated = value;
};

export const useUser = () =>
  useQuery<User | null>(['user'], getUserInfo, {
    enabled: isAuthenticated,
  });

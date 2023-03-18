import { User, UserProfile } from '@/types/types';
import { getUserInfo, getUserProfileByUsername } from '@/utils/UserService';
import { useQuery } from '@tanstack/react-query';

let isAuthenticated: boolean = false;
export const setIsAuthenticated = (value: boolean) => {
  isAuthenticated = value;
};

export const useUser = () =>
  useQuery<User | null>(['user'], getUserInfo, {
    enabled: isAuthenticated,
  });

export const useUserProfile = ({ username }: { username: string }) =>
  useQuery<UserProfile | null>(
    ['user-profile', { username: username }],
    () => getUserProfileByUsername(username),
    {
      enabled: Boolean(username),
    }
  );

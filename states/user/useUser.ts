import { User } from '@/types/types';
import { getUserInfo } from '@/utils/AuthService';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => useQuery<User | null>(['user'], getUserInfo);

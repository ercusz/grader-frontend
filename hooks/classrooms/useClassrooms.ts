import { ClassroomSlugResponse, MyClassroomsResponse } from '@/types/types';
import {
  filterMyClassroomsResponse,
  getClassroomBySlug,
  getClassrooms,
} from '@/utils/ClassroomService';
import { useQuery } from '@tanstack/react-query';

export const useClassrooms = () => useQuery(['classrooms'], getClassrooms);

export const useClassroomSlug = ({
  enabled,
  slug,
  initialData,
}: {
  enabled?: boolean;
  slug?: string;
  initialData?: ClassroomSlugResponse;
}) =>
  useQuery<ClassroomSlugResponse, Error>(
    ['classroom', { slug: slug }],
    () => getClassroomBySlug(slug ? slug : ''),
    {
      enabled: enabled === undefined ? Boolean(slug) : enabled,
      initialData: initialData,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

export const useClassroomsFilter = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter: string;
}) =>
  useQuery<MyClassroomsResponse, Error>(['classrooms', filter], getClassrooms, {
    enabled: enabled === undefined ? Boolean(filter) : enabled,
    select: (data: MyClassroomsResponse) =>
      filterMyClassroomsResponse(data, filter) as MyClassroomsResponse,
  });

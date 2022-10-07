import { useQuery } from '@tanstack/react-query';
import { Classroom } from '@/types/types';
import {
  filterData,
  getClassroomBySlug,
  getClassrooms,
} from '@/utils/ClassroomService';

export const useClassrooms = () => useQuery(['classrooms'], getClassrooms);

export const useClassroomSlug = ({
  enabled,
  slug,
  initialData,
}: {
  enabled?: boolean;
  slug?: string;
  initialData?: Classroom;
}) =>
  useQuery<Classroom, Error>(
    ['classroom', { slug: slug }],
    () => getClassroomBySlug(slug ? slug : ""),
    {
      enabled: enabled === undefined ? Boolean(slug) : enabled,
      initialData: initialData,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

export const useAllClassroomsCount = ({ enabled }: { enabled?: boolean }) =>
  useQuery<Classroom[], Error, number>(['classrooms'], getClassrooms, {
    enabled: enabled,
    select: (data: Classroom[]) => data.length,
    notifyOnChangeProps: ['data'],
  });

export const useFilteredClassroomsCount = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter: string;
}) =>
  useQuery<Classroom[], Error, number>(['classrooms', filter], getClassrooms, {
    enabled: enabled === undefined ? Boolean(filter) : enabled,
    select: (data: Classroom[]) => data.length,
  });

export const useClassroomsFilter = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter: string;
}) =>
  useQuery<Classroom[], Error>(['classrooms', filter], getClassrooms, {
    enabled: enabled === undefined ? Boolean(filter) : enabled,
    select: (data: Classroom[]) => filterData(data, filter) as Classroom[],
  });

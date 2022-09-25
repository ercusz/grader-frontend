import { useQuery } from '@tanstack/react-query';
import { Course } from '../../types/types';
import {
  filterData,
  getCourseBySlug,
  getCourses,
} from '../../utils/ClassroomService';

export const useCourses = () => useQuery(['courses'], getCourses);

export const useCourseSlug = ({
  enabled,
  slug,
  initialData,
}: {
  enabled?: boolean;
  slug: string;
  initialData?: Course;
}) =>
  useQuery<Course, Error>(
    ['course', { slug: slug }],
    () => getCourseBySlug(slug),
    {
      enabled: enabled === undefined ? Boolean(slug) : enabled,
      initialData: initialData,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

export const useAllCoursesCount = ({ enabled }: { enabled?: boolean }) =>
  useQuery<Course[], Error, number>(['courses'], getCourses, {
    enabled: enabled,
    select: (data: Course[]) => data.length,
    notifyOnChangeProps: ['data'],
  });

export const useFilteredCoursesCount = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter: string;
}) =>
  useQuery<Course[], Error, number>(['courses', filter], getCourses, {
    enabled: enabled === undefined ? Boolean(filter) : enabled,
    select: (data: Course[]) => data.length,
  });

export const useCoursesFilter = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter: string;
}) =>
  useQuery<Course[], Error>(['courses', filter], getCourses, {
    enabled: enabled === undefined ? Boolean(filter) : enabled,
    select: (data: Course[]) => filterData(data, filter) as Course[],
  });

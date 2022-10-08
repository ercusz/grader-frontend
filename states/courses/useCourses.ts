import { CourseSlugResponse, MyCoursesResponse } from '@/types/types';
import {
  filterMyCoursesResponse,
  getCourseBySlug,
  getCourses,
} from '@/utils/ClassroomService';
import { useQuery } from '@tanstack/react-query';

export const useCourses = () => useQuery(['courses'], getCourses);

export const useCourseSlug = ({
  enabled,
  slug,
  initialData,
}: {
  enabled?: boolean;
  slug?: string;
  initialData?: CourseSlugResponse;
}) =>
  useQuery<CourseSlugResponse, Error>(
    ['course', { slug: slug }],
    () => getCourseBySlug(slug ? slug : ''),
    {
      enabled: enabled === undefined ? Boolean(slug) : enabled,
      initialData: initialData,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

export const useCoursesFilter = ({
  enabled,
  filter,
}: {
  enabled?: boolean;
  filter: string;
}) =>
  useQuery<MyCoursesResponse, Error>(['courses', filter], getCourses, {
    enabled: enabled === undefined ? Boolean(filter) : enabled,
    select: (data: MyCoursesResponse) =>
      filterMyCoursesResponse(data, filter) as MyCoursesResponse,
  });

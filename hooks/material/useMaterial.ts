import { Material } from '@/types/types';
import { getMaterialById, getMaterials } from '@/utils/MaterialService';
import { useQuery } from '@tanstack/react-query';

export const useMaterials = ({ classroomId }: { classroomId?: string }) =>
  useQuery(
    ['materials', { classroomId: classroomId }],
    () => getMaterials(classroomId ? classroomId : ''),
    {
      enabled: Boolean(classroomId),
    }
  );

export const useMaterial = ({
  materialId,
  classroomId,
}: {
  materialId?: string;
  classroomId?: string;
}) =>
  useQuery<Material, Error>(
    ['material', { id: materialId }],
    () =>
      getMaterialById(
        materialId ? materialId : '',
        classroomId ? classroomId : ''
      ),
    {
      enabled: Boolean(classroomId) && Boolean(materialId),
    }
  );

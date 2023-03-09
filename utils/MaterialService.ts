import { ClassroomMaterials, CreateMaterial } from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';
import { docsExtensions, uploadFiles } from './UploadService';

export const createMaterial = async (body: CreateMaterial, files: File[]) => {
  try {
    let reqBody = {
      ...body,
      files: [],
    };

    if (files.length > 0) {
      const uploadedFiles = await uploadFiles(files, docsExtensions);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error('Cannot upload files to server');
      }

      reqBody['files'] = uploadedFiles;
    }

    const { err }: Response = await contentHttpClient.post(
      `/api/materials`,
      reqBody
    );

    if (err) {
      throw new Error('Create material failed.');
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getMaterials = async (
  classroomId: string
): Promise<ClassroomMaterials> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/materials`
  );
  if (err) {
    throw new Error('Get material data failed');
  }

  return res.data as ClassroomMaterials;
};

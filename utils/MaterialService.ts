import {
  ClassroomMaterials,
  CreateMaterial,
  EditMaterial,
  Material,
} from '@/types/types';
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

export const getMaterialById = async (
  materialId: string,
  classroomId: string
): Promise<Material> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/materials/${materialId}`
  );
  if (err) {
    throw new Error('get material data failed');
  }

  return res.data as Material;
};

export const editMaterial = async (
  materialId: string,
  classroomId: string,
  body: EditMaterial
) => {
  try {
    let reqBody = {
      ...body,
      files: body.files || [],
    };

    if (body.newFiles && body.newFiles.length > 0) {
      const uploadedFiles = await uploadFiles(body.newFiles, docsExtensions);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error('Cannot upload files to server');
      }

      const uploadedFileIds = uploadedFiles.map((file: any) => file.id);

      reqBody.files = [...reqBody.files, ...uploadedFileIds];
    }

    const { err }: Response = await contentHttpClient.patch(
      `/api/classrooms/${classroomId}/materials/${materialId}`,
      reqBody
    );

    if (err) {
      throw new Error('Update material failed.');
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export const deleteMaterial = async (
  materialId: string,
  classroomId: string
) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/materials/${materialId}`
  );

  if (err) {
    throw new Error('Delete material failed.');
  }
};

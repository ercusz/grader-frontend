import { CreateTopic, Topic } from '@/types/types';
import { contentHttpClient, Response } from './APIHelper';

export const createTopic = async (classroomId: string, body: CreateTopic) => {
  const { err }: Response = await contentHttpClient.post(
    `/api/classrooms/${classroomId}/topics`,
    body
  );

  if (err) {
    throw new Error('create topic failed');
  }
};

export const getTopics = async (classroomId: string): Promise<Topic[]> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/topics`
  );

  if (err) {
    throw new Error('get topics failed');
  }

  return res.data as Topic[];
};

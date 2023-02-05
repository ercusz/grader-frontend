import { CreateTopic, Topic, TopicWithAssignments } from '@/types/types';
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

export const getTopicById = async (
  topicId: string,
  classroomId: string
): Promise<TopicWithAssignments> => {
  const { res, err }: Response = await contentHttpClient.get(
    `/api/classrooms/${classroomId}/topics/${topicId}`
  );

  if (err) {
    throw new Error('get topic data failed');
  }

  return res.data as TopicWithAssignments;
};

export const deleteAssignmentTopic = async (
  topicId: string,
  classroomId: string,
  assignmentId: string
) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/topics/${topicId}/assignments/${assignmentId}`
  );

  if (err) {
    throw new Error('delete assignment topic failed');
  }

  return;
};

export const updateTopic = async (
  topicId: string,
  classroomId: string,
  body: CreateTopic & { assignments: number[] }
) => {
  const { err }: Response = await contentHttpClient.patch(
    `/api/classrooms/${classroomId}/topics/${topicId}`,
    body
  );

  if (err) {
    throw new Error('update topic failed');
  }

  return;
};

export const deleteTopic = async (topicId: string, classroomId: string) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/topics/${topicId}`
  );

  if (err) {
    throw new Error('delete topic failed');
  }

  return;
};

export const deleteTopicAndAssignments = async (
  topicId: string,
  classroomId: string
) => {
  const { err }: Response = await contentHttpClient.delete(
    `/api/classrooms/${classroomId}/topics/${topicId}/assignments`
  );

  if (err) {
    throw new Error('delete topic and assignments failed');
  }

  return;
};

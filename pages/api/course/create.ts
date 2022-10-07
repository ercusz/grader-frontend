import type { NextApiRequest, NextApiResponse } from 'next';
import { createCourse } from '@/utils/ClassroomService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const course = await createCourse(req.body);

  if (course) {
    res.status(200).send('Create course successful!');
  } else {
    res.status(500).send('Oops, something went wrong...');
  }
}

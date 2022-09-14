import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { createCourse } from '../../../utils/ClassroomService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  const course = await createCourse(token?.jwt, req.body);

  if (course) {
    res.status(200).send('Create course successful!');
  } else {
    res.status(500).send('Oops, something went wrong...');
  }
}

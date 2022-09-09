import type { NextApiRequest, NextApiResponse } from 'next';
import { signUp } from '../../../utils/AuthService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const errorMsg = await signUp(req.body);

  if (!errorMsg) {
    res.status(200).send('Create account successful!');
  } else {
    res.status(500).send(errorMsg);
  }
}

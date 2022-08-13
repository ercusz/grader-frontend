import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const strapiUrl = process.env.STRAPI_HOST;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.post(
      strapiUrl + '/api/auth/local/register',
      req.body
    );

    res.status(200).send('Create account successful!');
  } catch (error) {
    res.status(500).send('Create account failed!');
  }
}

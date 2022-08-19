import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ICreateSubmission, IGetSubmission } from '../../utils/submission';

const createSubmission = async ({
  languageId,
  sourceCode,
  stdin,
  expectedOutput,
}: ICreateSubmission) => {
  const formData = {
    language_id: languageId,
    source_code: Buffer.from(sourceCode).toString('base64'),
    stdin: stdin ? Buffer.from(stdin).toString('base64') : undefined,
    expected_output: expectedOutput
      ? Buffer.from(expectedOutput).toString('base64')
      : undefined,
  };
  const options = {
    method: 'POST',
    url: `${process.env.GRADER_HOST}/submissions/`,
    params: { base64_encoded: 'true' },
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-User': process.env.GRADER_X_AUTH_USER!,
      'X-Auth-Token': process.env.GRADER_X_AUTH_TOKEN!,
    },
    data: formData,
  };

  const res = await axios
    .request(options)
    .then(async function (response) {
      console.log('create submission data: ', response.data);
      const token = response.data.token;
      return token;
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      console.log('create submission error: ', error);
      return error;
    });

  return res;
};

const getSubmission = async (token: IGetSubmission) => {
  const options = {
    method: 'GET',
    url: `${process.env.GRADER_HOST}/submissions/${token}`,
    params: {
      base64_encoded: 'true',
      fields: 'stdout,stderr,status_id,compile_output,time,memory',
    },
    headers: {
      'X-Auth-User': process.env.GRADER_X_AUTH_USER!,
      'X-Auth-Token': process.env.GRADER_X_AUTH_TOKEN!,
    },
  };

  try {
    let response = await axios.request(options);
    console.log('get submission data: ', response.data);

    return response.data;
  } catch (err) {
    console.log('get submission error: ', err);

    return err;
  }
};

const fetchSubmissionUntilSuccess = async (
  token: IGetSubmission
): Promise<any> => {
  const submission = await getSubmission(token);
  const status_id = submission.status_id;

  if (status_id <= 2) {
    await new Promise((resolve) => {
      setTimeout(resolve, 2500);
    });

    return fetchSubmissionUntilSuccess(token);
  } else {
    return submission;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await createSubmission(req.body);

  if (axios.isAxiosError(token)) {
    res.status(500).send('Create submission failed!');
  } else {
    let submission = await fetchSubmissionUntilSuccess(token);
    res.status(200).send(submission);
  }
}

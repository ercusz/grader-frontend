import type { NextApiRequest, NextApiResponse } from 'next';
import { graderHttpClient, Response } from '@/utils/APIHelper';
import { ICreateSubmission, IGetSubmission } from '@/utils/GraderService';

const createSubmission = async ({
  languageId,
  sourceCode,
  additionalFiles,
  stdin,
  expectedOutput,
}: ICreateSubmission) => {
  const formData = {
    language_id: languageId,
    source_code: sourceCode
      ? Buffer.from(sourceCode).toString('base64')
      : undefined,
    additional_files: additionalFiles ? additionalFiles : undefined,
    stdin: stdin ? Buffer.from(stdin).toString('base64') : undefined,
    expected_output: expectedOutput
      ? Buffer.from(expectedOutput).toString('base64')
      : undefined,
  };
  const options = {
    params: { base64_encoded: 'true' },
    headers: {
      'X-Auth-User': process.env.GRADER_X_AUTH_USER!,
      'X-Auth-Token': process.env.GRADER_X_AUTH_TOKEN!,
    },
  };

  const { res, err }: Response = await graderHttpClient.post(
    '/submissions/',
    formData,
    options
  );

  if (err) {
    let error = err.response ? err.response.data : err;
    console.log('create submission error: ', error);
    return;
  }

  console.log('create submission data: ', res.data);
  const token = res.data.token;

  return token;
};

const getSubmission = async (token: IGetSubmission) => {
  const options = {
    method: 'GET',
    url: `/submissions/${token}`,
    params: {
      base64_encoded: 'true',
      fields: 'stdout,stderr,status_id,compile_output,time,memory',
    },
    headers: {
      'X-Auth-User': process.env.GRADER_X_AUTH_USER!,
      'X-Auth-Token': process.env.GRADER_X_AUTH_TOKEN!,
    },
  };

  const { res, err }: Response = await graderHttpClient.request(options);

  if (err) {
    console.log('get submission error: ', err);
    return;
  }

  console.log('get submission data: ', res.data);

  return res.data;
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

  if (!token) {
    res.status(500).send('Create submission failed!');
    return;
  }

  let submission = await fetchSubmissionUntilSuccess(token);
  res.status(200).send(submission);
}

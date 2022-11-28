import { IDETabs } from '@/hooks/grader/useIdeTabs';
import { Submission } from '@/types/types';
import { AxiosError } from 'axios';
import JSZip from 'jszip';
import { mainHttpClient, Response } from './APIHelper';

export interface ICreateSubmission {
  languageId: number;
  sourceCode?: string;
  additionalFiles?: string;
  stdin?: string;
  expectedOutput?: string;
}

export interface IGetSubmission {
  token: string;
}

export const createSubmission = async (
  submission: ICreateSubmission
): Promise<Submission | AxiosError> => {
  const { res, err }: Response = await mainHttpClient.post(
    '/api/grader',
    submission
  );
  if (err) {
    return {
      stdout: '',
      status_id: 15,
      time: 0,
      memory: 0,
      stderr: '',
      compile_output: '',
    };
  }

  return decodeSubmission(res.data) as Submission;
};

export const decodeSubmission = (submission: any): Submission => {
  submission.stdout = submission.stdout
    ? Buffer.from(submission.stdout, 'base64').toString('utf-8')
    : '';

  submission.stderr = submission.stderr
    ? Buffer.from(submission.stderr, 'base64').toString('utf-8')
    : '';

  submission.compile_output = submission.compile_output
    ? Buffer.from(submission.compile_output, 'base64').toString('utf-8')
    : '';

  return submission as Submission;
};

export const compressSourceCode = (files: IDETabs[]) => {
  var zip = new JSZip();
  zip.file('compile', '/usr/local/openjdk14/bin/javac Main.java');
  zip.file('run', '/usr/local/openjdk14/bin/java Main');
  for (const file of files) {
    zip.file(file.path, file.value);
  }
  return zip.generateAsync({ type: 'base64' });
};

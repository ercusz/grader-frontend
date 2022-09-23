import JSZip from 'jszip';
import { ITab } from '../components/code-editor/CodeEditor';
import { Submission } from '../types/types';
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

export const createSubmission = async (submission: ICreateSubmission): Promise<Submission> => {
  const { res }: Response = await mainHttpClient.post(
    '/api/grader',
    submission
  );

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

export const compressSourceCode = (files: ITab[]) => {
  var zip = new JSZip();
  zip.file('compile', '/usr/local/openjdk14/bin/javac Main.java');
  zip.file('run', '/usr/local/openjdk14/bin/java Main');
  for (const file of files) {
    zip.file(file.path, file.value);
  }
  return zip.generateAsync({ type: 'base64' });
};
import axios from 'axios';

export interface ICreateSubmission {
  languageId: number;
  sourceCode: string;
  stdin?: string;
  expectedOutput?: string;
}

export interface IGetSubmission {
  token: string;
}

export async function createSubmission(
  submission: ICreateSubmission
): Promise<any> {
  try {
    const res = await axios.post('/api/grader', submission);
    let data = res.data;
    data.stdout = data.stdout
      ? Buffer.from(data.stdout, 'base64').toString('utf-8')
      : '';

    data.stderr = data.stderr
      ? Buffer.from(data.stderr, 'base64').toString('utf-8')
      : '';

    data.compile_output = data.compile_output
      ? Buffer.from(data.compile_output, 'base64').toString('utf-8')
      : '';

    return data;
  } catch (error) {
    throw new Error();
  }
}

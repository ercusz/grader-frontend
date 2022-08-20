import axios from 'axios';
import JSZip from 'jszip';
import { ITab } from '../components/code-editor/CodeEditor';

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

export const sourceCodeZip = (files: ITab[]) => {
  var zip = new JSZip();
  zip.file("compile", "/usr/local/openjdk14/bin/javac Main.java");
  zip.file("run", "/usr/local/openjdk14/bin/java Main");
  for (const file of files) {
    zip.file(file.path, file.value);
  }
  return zip.generateAsync({type:"base64"});
}

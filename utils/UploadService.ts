import mime from 'mime-types';
import { contentHttpClient, Response } from './APIHelper';

export const imageExtensions = ['png', 'jpeg', 'jpg'];
export const docsExtensions = [
  ...imageExtensions,
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'zip',
  'rar',
  '7z',
];

export const isValidFileUploaded = (file: File, exts: string[]) => {
  const mimeType = file.type;
  const fileExtension = mime.extension(mimeType);
  return exts.includes(fileExtension as string);
};

export const uploadFiles = async (files: File[], exts: string[]) => {
  if (files.length === 0) throw new Error('Cannot upload empty file');

  const someFileInvalidType = files.some((file) => {
    return !isValidFileUploaded(file, exts);
  });
  if (someFileInvalidType) throw new Error('Invalid file type');

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const { res, err }: Response = await contentHttpClient.post(
    '/api/upload',
    formData
  );

  if (err) {
    throw new Error('Upload file failed.');
  }

  return res.data;
};

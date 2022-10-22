import { contentHttpClient, Response } from './APIHelper';

const imageExtensions = ['png', 'jpeg', 'jpg'];

const isValidFileUploaded = (file: File, exts: string[]) => {
  const fileExtension = file.type.split('/')[1];
  return exts.includes(fileExtension);
};

export const uploadImage = async (file: File) => {
  if (!file) throw new Error('File not found');

  if (!isValidFileUploaded(file, imageExtensions))
    throw new Error('Invalid file type');

  const formData = new FormData();
  formData.append('files', file);
  const { res, err }: Response = await contentHttpClient.post(
    '/api/upload',
    formData
  );
  if (err) {
    throw new Error('Upload image failed.');
  }

  return res.data.find(Boolean); // use .find(Boolean) for get first element of an array
};

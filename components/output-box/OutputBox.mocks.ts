import { IOutputBox } from './OutputBox';

const base: IOutputBox = {
  language: 'plaintext',
  template: 'Hello World! \nMy name is John Doe😎',
  queryKey: ["output"]
};

export const mockOutputBoxProps = {
  base,
};

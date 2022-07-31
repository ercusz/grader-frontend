import { ITestCasesList } from './TestCasesList';

const base: ITestCasesList = {
  testcases: [
    {
      id: 1,
      name: 'Testcase#1',
      input: 'John\nDoe',
      expectedOutput: "Hello, I'm John Doe!",
      status: 0,
    },
    {
      id: 2,
      name: 'Testcase#2',
      input: 'Peter\nParker',
      expectedOutput: "Hello, I'm Peter Parker!",
      status: 3,
    },
    {
      id: 3,
      name: 'Testcase#3',
      input: 'ปีเตอร์\nปาร์คเกอร์',
      expectedOutput: "Hello, I'm ปีเตอร์ ปาร์คเกอร์!",
      status: 4,
    },
    {
      id: 4,
      name: 'Testcase#4',
      input: 'โทนี่โทนี่\nช็อปเปอร์',
      expectedOutput: "Hello, I'm โทนี่โทนี่ ช็อปเปอร์!",
      status: 13,
    },
  ],
  setTestcases: () => {
    console.log('call setTestcases');
  },
};

export const mockTestCasesListProps = {
  base,
};

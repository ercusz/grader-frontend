export interface ICompileStatus {
  id: number;
  description: string;
  color:
    | 'info'
    | 'success'
    | 'error'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'warning'
    | undefined;
}

export const compileStatus = [
  {
    id: 0,
    description: 'Idle',
    color: 'info',
  },
  {
    id: 1,
    description: 'In Queue',
    color: 'info',
  },
  {
    id: 2,
    description: 'Processing',
    color: 'info',
  },
  {
    id: 3,
    description: 'Accepted',
    color: 'success',
  },
  {
    id: 4,
    description: 'Wrong Answer',
    color: 'error',
  },
  {
    id: 5,
    description: 'Time Limit Exceeded',
    color: 'error',
  },
  {
    id: 6,
    description: 'Compilation Error',
    color: 'error',
  },
  {
    id: 7,
    description: 'Runtime Error (SIGSEGV)',
    color: 'error',
  },
  {
    id: 8,
    description: 'Runtime Error (SIGXFSZ)',
    color: 'error',
  },
  {
    id: 9,
    description: 'Runtime Error (SIGFPE)',
    color: 'error',
  },
  {
    id: 10,
    description: 'Runtime Error (SIGABRT)',
    color: 'error',
  },
  {
    id: 11,
    description: 'Runtime Error (NZEC)',
    color: 'error',
  },
  {
    id: 12,
    description: 'Runtime Error (Other)',
    color: 'error',
  },
  {
    id: 13,
    description: 'Internal Error',
    color: 'error',
  },
  {
    id: 14,
    description: 'Exec Format Error',
    color: 'error',
  },
  {
    id: 15,
    description: 'Grader API Error',
    color: 'error',
  },
];

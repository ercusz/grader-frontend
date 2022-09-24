import { QueryClient, useQueries } from '@tanstack/react-query';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { Submission, TestCase } from '../../types/types';
import {
  compressSourceCode,
  createSubmission,
} from '../../utils/GraderService';
import { useIdeTabs } from './useIdeTabs';

export const testcases = atom<TestCase[]>([]);

const testcasesAtom = atom(
  (get) => get(testcases),
  (_, set, newTestcase: TestCase) =>
    set(testcases, (prev: TestCase[]) => [...prev, newTestcase])
);

const remover = atom(null, (get, set, id: number) =>
  set(
    testcases,
    get(testcases).filter((testcase) => testcase.id !== id)
  )
);

const loadingStatusSetter = atom(null, (get, set, { id, loading, status }) =>
  set(
    testcases,
    get(testcases).map((testcase) =>
      id === testcase.id
        ? { ...testcase, loading: loading, status: status }
        : testcase
    )
  )
);

export function useTestcases() {
  const [testcases, addTestcase] = useAtom(testcasesAtom);
  const [, removeTestcase] = useAtom(remover);
  const [, setTestcaseLoadAndStatus] = useAtom(loadingStatusSetter);
  const { ideTabs } = useIdeTabs();

  const runTestCase = async (testcase: TestCase) => {
    const src = await compressSourceCode(ideTabs);

    const params = {
      languageId: 89,
      sourceCode: undefined,
      additionalFiles: src,
      stdin: testcase.input,
      expectedOutput: testcase.expectedOutput,
    };

    setTestcaseLoadAndStatus({ id: testcase.id, loading: true, status: 0 });

    const queryClient = new QueryClient();
    const submission: Submission = await queryClient.fetchQuery(
      ['submission', testcase.id],
      () => createSubmission(params)
    );

    if (!submission) {
      setTestcaseLoadAndStatus({ id: testcase.id, loading: false, status: 15 });
      return;
    }

    setTestcaseLoadAndStatus({
      id: testcase.id,
      loading: false,
      status: submission.status_id,
    });

    return submission;
  };

  const submissions = useQueries({
    queries: testcases.map((testcase) => {
      return {
        queryKey: ['submission', testcase.id],
        queryFn: () => runTestCase(testcase),
        enabled: false,
      };
    }),
  });

  const refetchSubmissions = useCallback(() => {
    submissions.forEach((submission) => submission.refetch());
  }, [submissions]);

  const runAllTestCases = () => {
    refetchSubmissions();
  };

  return {
    testcases,
    addTestcase,
    removeTestcase,
    setTestcaseLoadAndStatus,
    runTestCase,
    runAllTestCases,
  } as const;
}

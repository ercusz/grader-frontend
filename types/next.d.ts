import { DehydratedState } from '@tanstack/react-query';
import type { Session } from 'next-auth';

declare module 'next/app' {
  type AppProps<P = Record<string, unknown>> = {
    pageProps: P & {
      session?: Session;
      dehydratedState: DehydratedState;
    };
  };
}

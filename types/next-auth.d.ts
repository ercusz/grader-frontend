import 'next-auth';
import { User as UserType } from './types';
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserType;
    jwt: string;
  }

  interface User {
    jwt: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    jwt: string;
  }
}

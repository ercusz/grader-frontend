import { DefaultSession } from 'next-auth';

interface IUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  firstName: string;
  lastName: string;
  role: { id: number; name: string };
  profile: { id: number; url: string };
}
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser & DefaultSession['user'];
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

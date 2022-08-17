import 'next-auth';

interface User {
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
  role: { id: number, name: string};
  profile: { id:number, url: string }
}
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }

  interface JWT {
    user: User;
  }
}

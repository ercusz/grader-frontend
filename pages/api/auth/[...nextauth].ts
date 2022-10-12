import { signIn } from '@/utils/AuthService';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Sign in with credentials',
      credentials: {
        identifier: { label: 'Username/Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        /**
         * This function is used to define if the user is authenticated or not.
         * If authenticated, the function should return an object contains the user data.
         * If not, the function should return `null`.
         */
        if (credentials == null) return null;
        /**
         * credentials is defined in the config above.
         * We can expect it contains two properties: `email` and `password`
         */
        const { user, jwt, errorMsg } = await signIn({
          identifier: credentials.identifier,
          password: credentials.password,
        });

        if (errorMsg) {
          throw new Error(errorMsg);
        }

        return { ...user, jwt };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token.jwt) {
        session.jwt = token.jwt;
      }

      return Promise.resolve(session);
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
      }

      return Promise.resolve(token);
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/api/auth/error',
  },
});

export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/course/:path*',
    '/classroom/:path*',
    '/profiles/:path*',
    '/settings/:path*',
    '/playground',
  ],
};

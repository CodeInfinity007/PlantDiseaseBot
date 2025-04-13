import { NextResponse } from 'next/server';

export function middleware(req) {
  const isLoggedIn = req.cookies.get('isLoggedIn');

  if (!isLoggedIn && req.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*'], // Apply middleware only to /chat
};

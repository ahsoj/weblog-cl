import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Auth from './lib/sdk/Authentication';

// /feed

const homeRoute = ['/foryou', '/following', '/popular', '/latest', '/news'];

const requireAuth = [homeRoute[0], homeRoute[1]];

const authPath = ['/signin', '/create_account'];

export function middleware(req: NextRequest) {
  const user = Auth.getUser();
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(
      new URL(user ? '/foryou' : '/popular', req.url)
    );
  }
  if (homeRoute.includes(req.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL('/', req.url));
  }
  if (!user && requireAuth.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(homeRoute[2], req.url));
  }
  if (user && authPath.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(homeRoute[0], req.url));
  }
}

export const config = {
  matcher: '/:path*',
};

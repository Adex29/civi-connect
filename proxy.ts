import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/session';
import type { UserRole } from './lib/definitions';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("session")?.value;
  let isAuth = false;
  let role: UserRole | undefined;

  if (sessionCookie) {
    const payload = await decrypt(sessionCookie);
    if (payload?.userId && payload?.role) {
      isAuth = true;
      role = payload.role;
    }
  }

  // If a session cookie was provided but could not be decrypted,
  // instruct the client browser to delete it to avoid infinite redirect loops.
  const isCorruptedSession = Boolean(sessionCookie && !isAuth);

  const cleanResponse = (response: NextResponse) => {
    if (isCorruptedSession) {
      response.cookies.delete("session");
    }
    return response;
  };

  // 1. Protected Admin Routes (/admin/dashboard and subpaths)
  if (pathname.startsWith('/admin/dashboard')) {
    if (!isAuth) {
      return cleanResponse(NextResponse.redirect(new URL('/admin', request.url)));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return isCorruptedSession ? cleanResponse(NextResponse.next()) : NextResponse.next();
  }

  // 2. Protected Student Routes (/dashboard and subpaths)
  if (pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      return cleanResponse(NextResponse.redirect(new URL('/login', request.url)));
    }
    if (role !== 'student') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return isCorruptedSession ? cleanResponse(NextResponse.next()) : NextResponse.next();
  }

  // 3. Admin Auth Page (/admin)
  if (pathname === '/admin') {
    if (isAuth) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      if (role === 'student') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return isCorruptedSession ? cleanResponse(NextResponse.next()) : NextResponse.next();
  }

  // 4. Student Auth Pages (/login, /register)
  if (pathname === '/login' || pathname === '/register') {
    if (isAuth) {
      if (role === 'student') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return isCorruptedSession ? cleanResponse(NextResponse.next()) : NextResponse.next();
  }

  return isCorruptedSession ? cleanResponse(NextResponse.next()) : NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

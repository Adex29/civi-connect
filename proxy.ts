import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/session';

export async function proxy(request: NextRequest) {
  // Update session to refresh expiration
  await updateSession();

  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("session")?.value;
  // Basic check, full decryption happens in DAL but we need to verify it's not a stale/invalid cookie
  let isAuth = false;
  if (sessionCookie) {
    const { decrypt } = await import('./lib/session');
    const payload = await decrypt(sessionCookie);
    isAuth = !!payload;
    if (!isAuth) {
      request.cookies.delete("session");
    }
  }

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin/dashboard')) {
    if (!isAuth) {
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Auth pages (redirect if already logged in)
  if (pathname === '/login' || pathname === '/register' || pathname === '/admin') {
    if (isAuth) {
      // In a real app we'd decode to check role, but DAL will handle exact redirection.
      // We can just optimistically redirect to student dashboard, DAL will kick admins to /admin if needed
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
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

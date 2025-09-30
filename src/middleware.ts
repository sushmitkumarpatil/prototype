import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const authToken = request.cookies.get('authToken')?.value;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/jobs', '/events', '/posts', '/messages', '/notifications', '/alumni', '/history'];
  const adminRoutes = ['/admin/dashboard', '/admin/users', '/admin/approvals', '/admin/content', '/admin/jobs', '/admin/events', '/admin/posts', '/admin/reports'];
  const authOnlyRoutes = ['/login', '/signup', '/']; // Routes only for non-authenticated users
  const adminAuthOnlyRoutes = ['/admin/login']; // Admin login route
  const publicRoutes = ['/about', '/']; // Routes accessible to everyone

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthOnlyRoute = authOnlyRoutes.some(route => pathname === route);
  const isAdminAuthOnlyRoute = adminAuthOnlyRoutes.some(route => pathname === route);
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Handle admin routes: require auth AND admin role
  const userRole = request.cookies.get('userRole')?.value || '';
  const isAdmin = userRole === 'TENANT_ADMIN' || userRole === 'SUPER_ADMIN';
  if (isAdminRoute) {
    if (!authToken || !isAdmin) {
      const adminLoginUrl = new URL('/admin/login', request.url);
      adminLoginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // If accessing admin login with auth token:
  // - Admins go to admin dashboard
  // - Non-admins go to user dashboard
  if (isAdminAuthOnlyRoute && authToken) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing protected route without auth token, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login/signup with auth token, redirect to dashboard
  if (isAuthOnlyRoute && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow access to public routes regardless of auth status
  if (isPublicRoute) {
    return NextResponse.next();
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
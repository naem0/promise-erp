import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import permissionsConfig from '@/config/permissions.json'
import { fetchMyPermissions } from '@/apiServices/auth/permissionService'

// Ensure we pick up the array from JSON
const routePermissions: { path: string; permissions: string[]; isDynamic?: boolean }[] = permissionsConfig.routes;

const protectedRoutes = [
  '/accounts',
  '/dashboard',
  '/hr',
  '/lms',
  '/profile',
  '/settings',
  '/divisions',
  '/districts',
  '/access-control',
  '/web-content',
  '/student',
  '/enrollment',
]

const authRoutes = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuth = !!token

  // 1. Redirect auth routes to dashboard if logged in
  if (authRoutes.includes(pathname) && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. Block unauthenticated users from accessing protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuth) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Very explicitly check permissions for authenticated users
  if (isAuth) {
    let userPermissions = (token?.permissions as string[]) || [];

    // Dynamically fetch fresh permissions from the backend on every page transition to bypass NextAuth JWT token caching
    try {
      const accessToken = token?.accessToken as string;
      if (accessToken) {
        const data = await fetchMyPermissions(accessToken);
        if (data?.success && data?.data?.permissions) {
          userPermissions = data.data.permissions;
        }
      }
    } catch (error) {
      // Sielntly fallback to JWT cache
    }



    // Sort by descending path length to avoid partial string matching bugs (e.g. /lms/courses/add matches before /lms/courses)
    const sortedRoutes = [...routePermissions].sort((a, b) => b.path.length - a.path.length);

    const matchedRoute = sortedRoutes.find(r => {
      // Dynamic route matching: e.g., /lms/courses/123/edit matches /lms/courses/edit
      if (r.isDynamic) {
        const basePath = r.path.split('/edit')[0]; // "/lms/courses"
        return pathname.startsWith(basePath) && pathname.endsWith('/edit');
      }

      // Exact string match (ignoring optional trailing slash on pathname)
      const cleanPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
      return cleanPathname === r.path;
    });

    // If an exact or dynamic rule matched, enforce permissions!
    // If NO rule matched (matchedRoute is undefined), we BLOCK by default to be safe,
    // ONLY IF the current path is deeply nested within standard protected modules.
    if (matchedRoute) {
      const allowed = matchedRoute.permissions.every(p => userPermissions.includes(p));

      if (!allowed) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } else {
      // Security fallback: Block deep/unexpected paths under /lms that don't have rules
      if (
        pathname.startsWith('/lms/courses/') ||
        pathname.startsWith('/lms/employees/') ||
        pathname.startsWith('/lms/teachers/')
      ) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/accounts/:path*',
    '/dashboard/:path*',
    '/hr/:path*',
    '/lms/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/divisions/:path*',
    '/districts/:path*',
    '/access-control/:path*',
    '/web-content/:path*',
    '/student/:path*',
    '/enrollment/:path*',
    '/login',
    '/register'
  ]
}
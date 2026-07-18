import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// Protected routes that require authentication
const protectedRoutes = ['/student', '/admin'];

// Admin-only routes
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if route is protected
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // Get token from cookies or Authorization header
    const token =
        request.cookies.get('token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('token');
        return response;
    }

    // Check admin routes
    const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
    );
    if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/student', request.url));
    }

    // Set user info in headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-role', payload.role);

    return response;
}

export const config = {
    matcher: ['/student/:path*', '/admin/:path*'],
};
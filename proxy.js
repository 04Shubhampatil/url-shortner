import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super_secret_fallback_key_for_dev'
);

export async function proxy(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Verify token
  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  // If visiting "/", redirect directly based on auth status
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }

  // If visiting "/dashboard" and not authenticated, redirect to "/register"
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }

  // If visiting auth pages ("/login" or "/register") and already authenticated, redirect to "/dashboard"
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register'],
};

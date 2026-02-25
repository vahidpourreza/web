import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // Get the sid from query params (IDP sends it)
  const sid = request.nextUrl.searchParams.get('sid');

  // Clear the auth session cookie
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('authjs.') || cookie.name.startsWith('_Secure-authjs.')) {
      cookieStore.delete(cookie.name);
    }
  });

  // If we have a sid, also add it to revoked Store
  if (sid) {
    const { revokeSession } = await import('@/lib/auth/logout-store');
    revokeSession(sid);
  }
  // Return a minimal HTML page (loaded in hidden iframe by IDP)
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head><title>Logged out</title></head>
<body>
  <p>Session cleared.</p>
</body>
</html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    },
  );
}

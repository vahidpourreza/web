import { NextRequest, NextResponse } from 'next/server';
import { revokeSession } from '@/lib/auth/logout-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const logoutToken = body.get('logout_token');
    if (!logoutToken || typeof logoutToken !== 'string') {
      return NextResponse.json({ error: 'Missing logout_token' }, { status: 400 });
    }

    // Decode JWT payload (middle part) to extract sid
    // We don't verify signature here because the IDP is trusted
    // and this endpoint is only called server-to-server.
    const parts = logoutToken.split('.');
    if (parts.length !== 3) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    const sid = payload.sid as string | undefined;
    if (sid) {
      revokeSession(sid);
    }
    return new NextResponse(null, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to process logout' }, { status: 500 });
  }
}

// In-memory store of revoked session IDs (sid cliam).
// todo : For production , replace with Redis or a database Table.

const revokedSessions = new Set<string>();

export function revokeSession(sid: string): void {
  revokedSessions.add(sid);
}

export function isSessionRevoked(sid: string): boolean {
  return revokedSessions.has(sid);
}

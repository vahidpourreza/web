export const invitationKeys = {
  all: ['invitation'] as const,
  pending: () => [...invitationKeys.all, 'pending'] as const,
  details: () => [...invitationKeys.all, 'detail'] as const,
  detail: (code: string) => [...invitationKeys.details(), code] as const,
};
